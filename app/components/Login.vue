<template>
  <GridLayout rows="4*, 1*, 8*" height="100%">
    <StackLayout row="0" marginTop="30">
      <Label class="titleText" text="Inloggen" fontSize=54em></Label>
    </StackLayout>
    <StackLayout row = "1">
      <Label class="opacityZero" ref="wrongLoginText" text="Deze inloggegevens zijn niet geldig. Probeer het opnieuw."></Label>
    </StackLayout>
    <StackLayout row="2">
      <StackLayout marginBottom="10">
        <TextField returnKeyType="next" autocapitalizationType="none" class="textFieldCorrect" ref="naam" hint="Gebruikersnaam of e-mailadres"></TextField>
        <TextField returnKeyType="done" autocapitalizationType="none" class="textFieldCorrect" ref="wachtwoord" hint="Wachtwoord" secure="true" @returnPress="logInMethod"></TextField>
      </StackLayout>
        <Button class="loginButton" text="Inloggen" @tap="logInMethod"></Button>
        <Button class="registerButton" text="Registreren" @tap="goToAanmaken"></Button>
      <Label textAlignment="center" @tap="goToAanvragen($event)">
        <FormattedString>
          <Label text="Geen account? "/>
          <Label class="linkText" text="Klik dan hier"/>
        </FormattedString>
      </Label>
    </StackLayout>
  </GridLayout>
</template>

<script lang="ts">
  import { TextField } from "@nativescript/core";
  import Vue from "nativescript-vue";
  import { Component } from "vue-property-decorator";
  import "./Loginstyle.css";
  import * as AppSettings from '@nativescript/core/application-settings';
  import {WriteFile, ReadFileSync, FileExist} from "@/Models/FileSystemFunctions";
  import newPerson from "~/Models/newPerson";

  @Component({ name: "Login", components: {}})
  
  export default class Login extends Vue {
    msg: string = "Login";
    public JSONString = "";
    usersList: Array<any> = [];

    //This method takes the users in the file UsersListJSON.json and puts them in the usersList array.
    usersUitJason(){
      if (FileExist("Models", "UsersListJSON.json") == true){
        var FileContent = ReadFileSync("Models", "UsersListJSON.json");
        var JSONFileUsers = JSON.parse(FileContent);
        var user;
        for (user in JSONFileUsers){
          this.usersList.push(JSONFileUsers[user]);
        }
      }
    }
    //Changes the variable "accountaanvragen" that exists on Home.vue to true with the "acaangevraagd" method which makes
    // the request account screen appear.
    goToAanvragen() {
      this.$emit("accountAangevraagd");
    }

    //Changes the variable "accountaanmaken" that exists on Home.vue to true with the "accountaangemaaktmethod" method which makes
    // the register screen appear.
    goToAanmaken(){
      this.$emit("accountAangemaakt");
    }

    //Used when clicking on the "Inloggen" button.
    logInMethod() {
      //Gets the naam, wachtwoord & wrongLoginText objects.
      let usernameTextField: TextField = (this.$refs.naam as any).nativeView as TextField;
      let passwordTextField: TextField = (this.$refs.wachtwoord as any).nativeView as TextField;
      let wrongLoginText = (this.$refs.wrongLoginText as any).nativeView;

      let loggedIn: boolean = false;
      let userToJSON: newPerson;
      this.usersList = [];

      this.usersUitJason();

      //Loops through the usersList that is defined on rule 75.
      for (var index in this.usersList){
        //Checks if your user has been found yet. If it's been found it will skip the check steps. This is usefull for if your
        //userlist contains a lot of users. AKA this has to do with better performance.
        if (loggedIn == false){
          //Checks if the username or email, and password is the same as the user from the usersList array.
          if ((this.usersList[index].username.toLowerCase() == usernameTextField.text.toLowerCase() || this.usersList[index].email.toLowerCase() == usernameTextField.text.toLowerCase()) && this.usersList[index].password == passwordTextField.text){
            //If the if-statement is correct it will change the class names of the username, password and wronglogintext objects
            //to the classnames that correspond with correct.
            usernameTextField.className = "textFieldCorrect";
            passwordTextField.className = "textFieldCorrect";
            wrongLoginText.className = "opacityZero";

            //Saves all of the users data in the app settings.
            AppSettings.setString("LoggedinUsername", this.usersList[index].username);
            AppSettings.setString("LoggedinPFPUrl", this.usersList[index].pfp_url);
            AppSettings.setString("LoggedinName", this.usersList[index].name);
            AppSettings.setString("LoggedinEmail", this.usersList[index].email);
            AppSettings.setString("LoggedinPassword", this.usersList[index].password);
            AppSettings.setString("LoggedinDescription", this.usersList[index].description);
            AppSettings.setString("LoggedinRole", this.usersList[index].role);
            AppSettings.setString("LoggedinID", this.usersList[index].ID);

            //User information to JSON string
            userToJSON = new newPerson(this.usersList[index].username, this.usersList[index].pfp_url, this.usersList[index].name, this.usersList[index].email, this.usersList[index].password, this.usersList[index].description, this.usersList[index].role, this.usersList[index].ID);
            this.JSONString = `${JSON.stringify(userToJSON)}`;
            WriteFile(this.JSONString, "Models", "CurrentUserJSON.json");
            
            let newUser: newPerson = new newPerson(
            this.usersList[index].username,
            this.usersList[index].pfp_url,
            this.usersList[index].name,
            this.usersList[index].email,
            this.usersList[index].password,
            this.usersList[index].description,
            this.usersList[index].role,
            this.usersList[index].ID
            );
            loggedIn = true;
            
            //Changes the variable "accountaanmaken" that exists on Home.vue to true with the "accountaangemaaktmethod"
            //method which makes the posts screen appear.
            console.log("Going to home!");
            this.$emit("onLogin", newUser);
          }
        }
      }
      //Clears the password textfield and changes the class names of the username, password and wronglogintext objects
      //to the classnames that correspond with incorrect.
      passwordTextField.text = "";
      if (loggedIn == false){  
        usernameTextField.className = "textFieldIncorrect";
        passwordTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }
    }
  }
</script>
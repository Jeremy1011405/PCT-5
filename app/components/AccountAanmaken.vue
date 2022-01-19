<template>
<AbsoluteLayout>
  <GridLayout rows="4*, 1*, 8*" height="100%" width="100%">
    <Label marginTop="30" class="titleText" text="Account Aanmaken" fontSize=25em></Label>
    <Label marginTop="70" class="opacityZero" ref="inputManditory" text="De invulvakken met een ster '*' zijn verplicht"></Label>
    <Label marginTop="70" class="opacityZero" ref="verkeerdecode" text="De ingevulde code is onjuist."></Label>
    <Label marginTop="70" class="opacityZero" ref="algebruikt" text="De ingevulde gegevens worden al gebruikt."></Label>
    <Label marginTop="70" class="opacityZero" ref="gelukt" text="Gelukt! Uw account is aangemaakt. U kunt nu door naar het inlogscherm!"></Label>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="90" ref="Toegangscode" hint="Toegangscode *"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="170" ref="Username" hint="Gebruikersnaam *"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="250" ref="Fullname" hint="Uw volledige naam *"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="330" ref="Emailadres" hint="E-mailadres *"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="410" secure="true" ref="Wachtwoord" hint="Wachtwoord *"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="490" ref="ProfielfotoURL" hint="Profielfoto link (URL)"></TextField>
    <TextField autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="570" ref="Profielbeschrijving" hint="Profielbeschrijving"></TextField>
    <Button class="requestAccountButton" marginTop="710" text="Account Aanmaken" @tap="createAccountMethod"></Button>
  </GridLayout>
</AbsoluteLayout>
</template>

<script lang="ts">
  import { TextField } from "@nativescript/core";
  import Vue from "nativescript-vue";
  import { Component } from "vue-property-decorator";
  import "./Loginstyle.css";
  import * as AppSettings from '@nativescript/core/application-settings';
  import {WriteFile, ReadFileSync, FileExist} from "@/Models/FileSystemFunctions";

  @Component({ name: "AccountAanvragen", components: {}})
  
  export default class AccountAanmaken extends Vue {
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

    createAccountMethod() {
      let ToegangscodeTextField: TextField = (this.$refs.Toegangscode as any).nativeView as TextField;
      let UsernameTextField: TextField = (this.$refs.Username as any).nativeView as TextField;
      let FullnameTextField: TextField = (this.$refs.Fullname as any).nativeView as TextField;
      let EmailadresTextField: TextField = (this.$refs.Emailadres as any).nativeView as TextField;
      let WachtwoordTextField: TextField = (this.$refs.Wachtwoord as any).nativeView as TextField;
      let ProfielfotoURLTextField: TextField = (this.$refs.ProfielfotoURL as any).nativeView as TextField;
      let ProfielbeschrijvingTextField: TextField = (this.$refs.Profielbeschrijving as any).nativeView as TextField;
      let wrongLoginText = (this.$refs.inputManditory as any).nativeView;
      let gebruiktText = (this.$refs.algebruikt as any).nativeView;
      let verkeerdecode = (this.$refs.verkeerdecode as any).nativeView;
      let gelukt = (this.$refs.gelukt as any).nativeView;
      let thecode = "";
      let oneused = false;

      ToegangscodeTextField.text = ToegangscodeTextField.text.trim();
      UsernameTextField.text = UsernameTextField.text.trim();
      FullnameTextField.text = FullnameTextField.text.trim();
      EmailadresTextField.text = EmailadresTextField.text.trim();
      ProfielfotoURLTextField.text = ProfielfotoURLTextField.text.trim();
      WachtwoordTextField.text = WachtwoordTextField.text.trim();
      ProfielbeschrijvingTextField.text = ProfielbeschrijvingTextField.text.trim();

      wrongLoginText.className = "opacityZero";
      verkeerdecode.className = "opacityZero";
      gebruiktText.className = "opacityZero";
      gelukt.className = "opacityZero";

      if (AppSettings.getBoolean("accountRequested") == true){
        thecode = AppSettings.getString("AccountAanvragenKey");
      }
      
      // checkt of de texfields leeg zijn of niet
      if (ToegangscodeTextField.text != ""){
        ToegangscodeTextField.className = "textFieldCorrect";
      }
      if (ToegangscodeTextField.text == ""){
        ToegangscodeTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }
      if (UsernameTextField.text != ""){
        UsernameTextField.className = "textFieldCorrect";
      }
      if (UsernameTextField.text == ""){
        UsernameTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }
      if (FullnameTextField.text != ""){
        FullnameTextField.className = "textFieldCorrect";
      }
      if (FullnameTextField.text == ""){
        FullnameTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }
      if (EmailadresTextField.text != ""){
        EmailadresTextField.className = "textFieldCorrect";
      }
      if (EmailadresTextField.text == ""){
        EmailadresTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }
      if (WachtwoordTextField.text != ""){
        WachtwoordTextField.className = "textFieldCorrect";
      }
      if (WachtwoordTextField.text == ""){
        WachtwoordTextField.className = "textFieldIncorrect";
        wrongLoginText.className = "wrongInput";
      }

      if (ToegangscodeTextField.text != "" && UsernameTextField.text != "" && FullnameTextField.text != "" && EmailadresTextField.text != "" && WachtwoordTextField.text != ""){
        if (ToegangscodeTextField.text == thecode){
          this.usersUitJason();
          oneused = false;
          for (var index in this.usersList){
            if (this.usersList[index].username.toLowerCase() == UsernameTextField.text.toLowerCase()){ gebruiktText.className = "alGebruikt"; UsernameTextField.className = "textFieldUsed"; oneused = true; }
            if (this.usersList[index].email.toLowerCase() == EmailadresTextField.text.toLowerCase()){ gebruiktText.className = "alGebruikt"; EmailadresTextField.className = "textFieldUsed"; oneused = true; }
          }
          if (oneused == false){
            let url = ProfielfotoURLTextField.text;
            if (ProfielfotoURLTextField.text == ""){
              url = "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg";
            }

            let profileDescription = ProfielbeschrijvingTextField.text;
            if(ProfielbeschrijvingTextField.text == ""){
              profileDescription = "Leeg";
            }

            gelukt.className = "accountCreated";
            var JSONuserlist = JSON.parse(ReadFileSync("Models", "UsersListJSON.json"));
            JSONuserlist.push({
              username: UsernameTextField.text,
              pfp_url: url,
              name: FullnameTextField.text,
              email: EmailadresTextField.text,
              password: WachtwoordTextField.text,
              description: profileDescription,
              role: "Student",
              ID: `U${this.usersList.length + 1}`
            })
            this.JSONString = JSON.stringify(JSONuserlist);
            WriteFile(this.JSONString, "Models", "UsersListJSON.json");
            ToegangscodeTextField.text = "";
            UsernameTextField.text = "";
            FullnameTextField.text = "";
            EmailadresTextField.text = "";
            WachtwoordTextField.text = "";
            ProfielfotoURLTextField.text = "";
            ProfielbeschrijvingTextField.text = "";
            AppSettings.remove("accountRequested");
            AppSettings.remove("sendToOwner");
            AppSettings.remove("AccountAanvragenKey");
            AppSettings.setBoolean("accountRequested", false);
          }

        }
        else{
          verkeerdecode.className = "wrongInput";
          ToegangscodeTextField.className = "textFieldIncorrect";
        }
      }
    }
  }
</script>
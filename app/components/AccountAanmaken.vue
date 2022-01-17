<template>
<AbsoluteLayout>
  <GridLayout rows="4*, 1*, 8*" height="100%" width="100%">
    <Label ref="accaantextref" marginTop="30" class="accaantext" text="Account Aanmaken" fontSize=25em></Label>
    <Label marginTop="70" class="verplicht" ref="badlog2" text="De invulvakken met een ster '*' zijn verplicht"></Label>
    <Label marginTop="70" class="verkeerdecode" ref="verkeerdcode" text="De ingevulde code is onjuist."></Label>
    <Label marginTop="70" class="gebruikt" ref="algebruikt" text="De ingevulde gegevens worden al gebruikt."></Label>
    <Label marginTop="70" class="accountaangemaaktgelukt" ref="geluktt" text="Gelukt! Uw account is aangemaakt. U kunt nu door naar het inlogscherm!"></Label>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="90" ref="Toegangscode" hint="Toegangscode *"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="170" ref="Username" hint="Gebruikersnaam *"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="250" ref="Fullname" hint="Uw volledige naam *"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="330" ref="Emailadres" hint="E-mailadres *"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="410" secure="true" ref="Wachtwoord" hint="Wachtwoord *"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="490" ref="ProfielfotoURL" hint="Profielfoto link (URL)"></TextField>
    <TextField autocapitalizationType="none" class="nom2" height="7%" marginTop="570" ref="Profielbeschrijving" hint="Profielbeschrijving"></TextField>
    <Button class="accaanbutton" marginTop="710" text="Account Aanmaken" @tap="onLinkTap"></Button>
  </GridLayout>
</AbsoluteLayout>
</template>

<script lang="ts">
  import { Button, Color, EventData, Span, TapGestureEventData, TextField } from "@nativescript/core";
  import Vue from "nativescript-vue";
  import { Component, Prop } from "vue-property-decorator";
  import "./Loginstyle.css";
  import * as AppSettings from '@nativescript/core/application-settings';
  import {WriteFile, ReadFile, ReadFileSync, FileExist} from "@/Models/FileSystemFunctions";
  var clipboard = require("nativescript-clipboard");

  @Component({ name: "AccountAanvragen", components: {}})
  
  export default class AccountAanmaken extends Vue {
    msg: string = "AccountAanvragen";
    public JSONString = "";
    users: Array<any> = [];

    usersuitjason(){
      try{
        if (FileExist("Models", "UsersListJSON.json") == true){
          var FileContent = ReadFileSync("Models", "UsersListJSON.json");
          var JSONFileUsers = JSON.parse(FileContent);
          var user;
          for (user in JSONFileUsers){
            this.users.push(JSONFileUsers[user]);
            console.log(this.users)
          }
          console.log("Test: " + JSONFileUsers)
        }
      }
      catch (error)
      { 
        console.log(error)
      }
    }
    
    onLinkTap(args: TapGestureEventData) {
      let Toegangscode: TextField = (this.$refs.Toegangscode as any).nativeView as TextField;
      let Username: TextField = (this.$refs.Username as any).nativeView as TextField;
      let Fullname: TextField = (this.$refs.Fullname as any).nativeView as TextField;
      let Emailadres: TextField = (this.$refs.Emailadres as any).nativeView as TextField;
      let Wachtwoord: TextField = (this.$refs.Wachtwoord as any).nativeView as TextField;
      let ProfielfotoURL: TextField = (this.$refs.ProfielfotoURL as any).nativeView as TextField;
      let Profielbeschrijving: TextField = (this.$refs.Profielbeschrijving as any).nativeView as TextField;
      let blt = (this.$refs.badlog2 as any).nativeView;
      let gebrukt = (this.$refs.algebruikt as any).nativeView;
      let verkeerdecod = (this.$refs.verkeerdcode as any).nativeView;
      let geluk = (this.$refs.geluktt as any).nativeView;
      let thecode = "";
      let oneused = false;

      blt.className = "verplicht";
      verkeerdecod.className = "verkeerdecode";
      gebrukt.className = "gebruikt";
      geluk.className = "accountaangemaaktgelukt";

      if (AppSettings.getBoolean("accountRequested") == true){
        thecode = AppSettings.getString("AccountAanvragenKey");
      }
      
      // checkt of de texfields leeg zijn of niet
      if (Toegangscode.text != ""){
        Toegangscode.className = "nom2";
      }
      if (Toegangscode.text == ""){
        Toegangscode.className = "WrongG2";
        blt.className = "badlogin3";
      }
      if (Username.text != ""){
        Username.className = "nom2";
      }
      if (Username.text == ""){
        Username.className = "WrongG2";
        blt.className = "badlogin3";
      }
      if (Fullname.text != ""){
        Fullname.className = "nom2";
      }
      if (Fullname.text == ""){
        Fullname.className = "WrongG2";
        blt.className = "badlogin3";
      }
      if (Emailadres.text != ""){
        Emailadres.className = "nom2";
      }
      if (Emailadres.text == ""){
        Emailadres.className = "WrongG2";
        blt.className = "badlogin3";
      }
      if (Wachtwoord.text != ""){
        Wachtwoord.className = "nom2";
      }
      if (Wachtwoord.text == ""){
        Wachtwoord.className = "WrongG2";
        blt.className = "badlogin3";
      }

      if (Toegangscode.text != "" && Username.text != "" && Fullname.text != "" && Emailadres.text != "" && Wachtwoord.text != ""){
        if (Toegangscode.text == thecode){
          this.usersuitjason();
          oneused = false;
          for (var index in this.users){
            if (this.users[index].username.toLowerCase() == Username.text.toLowerCase()){ gebrukt.className = "algebruikt1"; Username.className = "WrongA"; oneused = true; }
            if (this.users[index].email.toLowerCase() == Emailadres.text.toLowerCase()){ gebrukt.className = "algebruikt1"; Emailadres.className = "WrongA"; oneused = true; }
          }
          if (oneused == false){
            let url = ProfielfotoURL.text;
            if (ProfielfotoURL.text == ""){
              url = "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg";
            }

            let descript = Profielbeschrijving.text;
            if(Profielbeschrijving.text == ""){
              descript = "Leeg";
            }

            geluk.className = "accaangelukt";
            var JSONuserlist = JSON.parse(ReadFileSync("Models", "UsersListJSON.json"));
            JSONuserlist.push({
              username: Username.text,
              pfp_url: url,
              name: Fullname.text,
              email: Emailadres.text,
              password: Wachtwoord.text,
              description: descript,
              role: "Student",
              ID: `U${this.users.length + 1}`
            })
            this.JSONString = JSON.stringify(JSONuserlist);
            WriteFile(this.JSONString, "Models", "UsersListJSON.json");
            Toegangscode.text = "";
            Username.text = "";
            Fullname.text = "";
            Emailadres.text = "";
            Wachtwoord.text = "";
            ProfielfotoURL.text = "";
            Profielbeschrijving.text = "";
            AppSettings.remove("accountRequested");
            AppSettings.remove("codething");
            AppSettings.remove("AccountAanvragenKey");
            AppSettings.setBoolean("accountRequested", false);
          }

        }
        else{
          verkeerdecod.className = "verkeerdecode2";
          Toegangscode.className = "WrongG2";
        }
      }
    }
  }
</script>
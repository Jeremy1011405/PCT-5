<template>
<GridLayout>
  <AbsoluteLayout>
    <GridLayout rows="4*, 1*, 8*" height="100%" width="100%">
      <Label ref="geluktText" marginTop="30" class="opacityZero" text="Gelukt!" fontSize=35em></Label>
      <Label ref="requestAccountText" marginTop="30" class="titleText" text="Account Aanvragen" fontSize=25em></Label>
      <Label marginTop="85" class="opacityZero" ref="inputManditory" text="De invulvakken met een ster '*' zijn verplicht"></Label>
      <TextField returnKeyType="next" autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="140" ref="voornaam" hint="Voornaam *"></TextField>
      <TextField returnKeyType="next" autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="230" ref="achternaam" hint="Achternaam *"></TextField>
      <TextField returnKeyType="next" autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="320" ref="emailadres" hint="E-mailadres *"></TextField>
      <TextField returnKeyType="done" autocapitalizationType="none" class="textFieldCorrect" height="7%" marginTop="410" ref="role" hint="Student, sponsor, etc. *" @returnPress="requestAccountMethod"></TextField>
      <Button ref="requestAccountButtonRef" class="requestAccountButton" marginTop="560" text="Account Aanvragen" @tap="requestAccountMethod"></Button>
    </GridLayout>
  </AbsoluteLayout>
  <GridLayout>
    <Label ref="accountRequestedText1" marginTop="9999999" class="accountRequestedText" text="Er is een code gegenereerd en deze is" fontSize=15em></Label>
    <Label ref="accountRequestedText2" marginTop="9999999" class="accountRequestedText" text="gekopieerd naar uw klembord. Om een" fontSize=15em></Label>
    <Label ref="accountRequestedText3" marginTop="9999999" class="accountRequestedText" text="account aan te kunnen maken, heeft u een" fontSize=15em></Label>
    <Label ref="accountRequestedText4" marginTop="9999999" class="accountRequestedText" text="code nodig. Hiervoor moet u de gegenereerde" fontSize=15em></Label>
    <Label ref="accountRequestedText5" marginTop="9999999" class="accountRequestedText" text="code via de mail naar de beheerder sturen." fontSize=15em></Label>
    <Label ref="accountRequestedText6" marginTop="9999999" class="accountRequestedText" text="Dan krijgt u een toegangscode die ingevuld" fontSize=15em></Label>
    <Label ref="accountRequestedText7" marginTop="9999999" class="accountRequestedText" text="kan worden bij het account aanmaken scherm." fontSize=15em></Label>
  </GridLayout>
</GridLayout>
</template>

<script lang="ts">
  import { Button, TapGestureEventData, TextField } from "@nativescript/core";
  import Vue from "nativescript-vue";
  import { Component } from "vue-property-decorator";
  import "./Loginstyle.css";
  import * as AppSettings from '@nativescript/core/application-settings';
  var clipboard = require("nativescript-clipboard");

  @Component({ name: "AccountAanvragen", components: {}})
  
  export default class AccountAanvragen extends Vue {
    msg: string = "AccountAanvragen";

    //Returns a random number between min and max
    getRandomIntInclusive(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //Removes the TextFields, Labels, etc that represent the Create Account Screen and replaces it with a "you succeeded"
    //text with some instructions. A few TextFields have been given to the method to reduce the declarations.
    accountGelukt(args: TapGestureEventData, voornaamTextField: TextField, achternaamTextField: TextField, emailadresTextField: TextField, roleTextField: TextField){
      let requestAccountText = (this.$refs.requestAccountText as any).nativeView;
      let requestAccountButton: Button = args.object as Button;
      let wrongLoginText = (this.$refs.inputManditory as any).nativeView;
      let geluktText = (this.$refs.geluktText as any).nativeView;
      let accountRequestedText1 = (this.$refs.accountRequestedText1 as any).nativeView;
      let accountRequestedText2 = (this.$refs.accountRequestedText2 as any).nativeView;
      let accountRequestedText3 = (this.$refs.accountRequestedText3 as any).nativeView;
      let accountRequestedText4 = (this.$refs.accountRequestedText4 as any).nativeView;
      let accountRequestedText5 = (this.$refs.accountRequestedText5 as any).nativeView;
      let accountRequestedText6 = (this.$refs.accountRequestedText6 as any).nativeView;
      let accountRequestedText7 = (this.$refs.accountRequestedText7 as any).nativeView;

      //The disappearance of the account request objects.
      requestAccountButton.marginTop = 9999999;
      voornaamTextField.marginTop = 9999999;
      achternaamTextField.marginTop = 9999999;
      emailadresTextField.marginTop = 9999999;
      roleTextField.marginTop = 9999999;
      wrongLoginText.marginTop = 9999999;
      requestAccountText.marginTop = 9999999;
      requestAccountButton.opacity = 0;
      voornaamTextField.opacity = 0;
      achternaamTextField.opacity = 0;
      emailadresTextField.opacity = 0;
      roleTextField.opacity = 0;
      wrongLoginText.opacity = 0;
      requestAccountText.opacity = 0;

      //The appearance of the you succeeded text with instructions.
      geluktText.className = "titleText";
      accountRequestedText1.marginTop = 100;
      accountRequestedText2.marginTop = 125;
      accountRequestedText3.marginTop = 150;
      accountRequestedText4.marginTop = 175;
      accountRequestedText5.marginTop = 200;
      accountRequestedText6.marginTop = 225;
      accountRequestedText7.marginTop = 250;
    }
    
    //Creates a code that you have to send to the owner. It checks if a textfield is empty or not every button press.
    requestAccountMethod(args: TapGestureEventData) {
      //Grabs the Textfield as objects.
      let voornaamTextField: TextField = (this.$refs.voornaam as any).nativeView as TextField;
      let achternaamTextField: TextField = (this.$refs.achternaam as any).nativeView as TextField;
      let emailadresTextField: TextField = (this.$refs.emailadres as any).nativeView as TextField;
      let roleTextField: TextField = (this.$refs.role as any).nativeView as TextField;
      let wrongLoginText = (this.$refs.inputManditory as any).nativeView;
      let realButton: Button = (this.$refs.requestAccountButtonRef as any).nativeView as Button;

      //Creates 2 variables with 36 random characters.
      const randomCharacters1 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const randomCharacters2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      //Checks if an account has been requested before. If yes, it copy's the previously generated code to the clipboard.
      if (AppSettings.getBoolean("accountRequested") == true){
        this.accountGelukt(args, voornaamTextField, achternaamTextField, emailadresTextField, roleTextField);
        clipboard.setTextSync(AppSettings.getString("sendToOwner"));
      }
      else{
        //Removes unwanted spaces at the start and end of a string.
        voornaamTextField.text = voornaamTextField.text.trim();
        achternaamTextField.text = achternaamTextField.text.trim();
        emailadresTextField.text = emailadresTextField.text.trim();
        roleTextField.text = roleTextField.text.trim();

        //If the textfields are not empty, the class names will change to TextFieldCorrect.
        if (voornaamTextField.text != ""){ voornaamTextField.className = "textFieldCorrect";  }
        if (achternaamTextField.text != ""){ achternaamTextField.className = "textFieldCorrect"; }
        if (emailadresTextField.text != ""){ emailadresTextField.className = "textFieldCorrect"; }
        if (roleTextField.text != ""){ roleTextField.className = "textFieldCorrect"; }

        //If the textfields are empty, the class names will change to TextFieldIncorrect.
        if (voornaamTextField.text == ""){ voornaamTextField.className = "textFieldIncorrect"; wrongLoginText.className = "wrongInput"; }
        if (achternaamTextField.text == ""){ achternaamTextField.className = "textFieldIncorrect"; wrongLoginText.className = "wrongInput"; }
        if (emailadresTextField.text == ""){ emailadresTextField.className = "textFieldIncorrect"; wrongLoginText.className = "wrongInput"; }
        if (roleTextField.text == ""){ roleTextField.className = "textFieldIncorrect"; wrongLoginText.className = "wrongInput"; }

        //Creates a code if all 4 textfields are not empty.
        if (voornaamTextField.text != "" && achternaamTextField.text != "" && emailadresTextField.text != "" && roleTextField.text != ""){
          //Gets back either 1 or 2 and creates a code. Example:
          //Rick Slingerland, rickyman2002.rick@gmail.com, Student (2) (26996m5tnfkv760ixjm3f, wj0c7yn3t994d1mgpyvt29).
          const randomInt = this.getRandomIntInclusive(1,2);
          const sendToOwner = voornaamTextField.text + " " + achternaamTextField.text + ", " + emailadresTextField.text + ", " + roleTextField.text + " (" + randomInt + ") (" + randomCharacters2 + ", " + randomCharacters1 + ").";
          
          //Copy's the previously generated code to the user's clipboard. Now all he has to do is send an email to the
          //owner with that code. It also stores the code in the app settings for future reference. Then it stores
          //the boolean accountRequested in app settings so when you attempt to request another account, it will just
          //give you the same code you generated earlier.
          clipboard.setTextSync(sendToOwner);
          AppSettings.setString("sendToOwner", sendToOwner);
          AppSettings.setBoolean("accountRequested", true);

          //Chooses one of the 2 codes through randomInt and saves it to app settings so it can be used as an access code
          //in the create account screen.
          if (randomInt == 1){
            AppSettings.setString("AccountAanvragenKey", randomCharacters2);
          }
          else{
            AppSettings.setString("AccountAanvragenKey", randomCharacters1);
          }
          this.accountGelukt(args, voornaamTextField, achternaamTextField, emailadresTextField, roleTextField);
          wrongLoginText.className = "opacityZero";
          realButton.opacity = 0;
          realButton.marginTop = 9999999;
        }
      }
    }
  }
</script>
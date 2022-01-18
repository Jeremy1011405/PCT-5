<template>
  <Page actionBarHidden="true">
    <AbsoluteLayout>
    <GridLayout rows="2*, 12*, *" height="100%" width=100%>
      <Login row="1" v-show="!loggedIn&&!accountaanvragen&&!accountaanmaken" @onLogin="login" @accountAangemaakt="accountaangemaaktmethod" @accountAangevraagd="acaangevraagd"/>
      <AccountAanvragen row="1" v-show="accountaanvragen" @accountAangevraagd="acaangevraagd"/>
      <AccountAanmaken row="1" v-show="accountaanmaken" @accountAangemaakt="accountaangemaaktmethod"/>
    </GridLayout>
    <GridLayout height="100%" width=100%>
      <Posts row="1" v-show="loggedIn&&!accountaanvragen&&!accountaanmaken" @onLogin="login"/>
    </GridLayout>
    <GridLayout rows="2*, 12*, *" height="100%" width=100%>
      <ActionBarTop row="0" v-show="loggedIn"/>
      <ActionBarTopLogIn row="0" v-show="!loggedIn"/>
      <ActionBarBottom row="2" />
    </GridLayout>
    <GridLayout columns="60, 410, 60" rows="50, 720, 60">
        <Image v-show="accountaanvragen" src="~/Images/back_btn.png" row="0" col="0" marginTop="10" @tap="acaangevraagd" ></Image>
        <Image v-show="accountaanmaken" src="~/Images/back_btn.png" row="0" col="0" marginTop="10" @tap="accountaangemaaktmethod" ></Image>
      </GridLayout>
    <GridLayout columns="60, 410, 60" rows="50, 720, 60">
      <Button v-show="loggedIn" class="logoutbutton" text="Uitloggen" @tap="login"></Button>
    </GridLayout>
      <Image :src="this.loggedinprofile" width="40" height="40" class="profile-pic"></Image>
    </AbsoluteLayout>
  </Page>
</template>

<script lang="ts">  
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";
import ActionBarTop from "./ActionBars/ActionBarTop.vue";
import ActionBarTopLogIn from "./ActionBars/ActionBarTopLogIn.vue";
import ActionBarBottom from "./ActionBars/ActionBarBottom.vue";
import Login from "./Login.vue";
import Posts from "./Posts.vue";
import AccountAanmaken from "./AccountAanmaken.vue";
import AccountAanvragen from "./AccountAanvragen.vue";
import * as AppSettings from '@nativescript/core/application-settings';
import {WriteFile, ReadFileSync, FileExist} from "@/Models/FileSystemFunctions";
import Post from "@/Models/Post";
import newPerson from "@/Models/newPerson";

if (!AppSettings.hasKey("Loggedin")){
  AppSettings.setBoolean("Loggedin", false);
}
if (!AppSettings.hasKey("accountRequested")){
  AppSettings.setBoolean("accountRequested", false);
}

if (FileExist("Models", "UsersListJSON.json") != true){
  let JSONString = "";
  let users = [new newPerson("Rickert",
  "https://yt3.ggpht.com/OHpZx8wQoQZiu45LMfcSKvDBO6gfR5_1ro_ZbS3xVpcRIu4Zqy_uHoWKpEdxTUD_Spq6zck0=s900-c-k-c0x00ffffff-no-rj",
  "Rick Slingerland", "kotorem.sama@gmail.com", "WttBo87?!", "Oh, come on. Really? I'm a few minutes late and you're gonna call me out infront of everyone?", "Student", "U1"),
  new newPerson("Jeremy123", "https://i.pinimg.com/originals/d1/1e/20/d11e20d44501e1a59439b5344e07f5d7.jpg",
  "Jeremy Jonker", "test.studenten@gmail.com", "password1", "Good Idea! Everyone, gather around so I can call out Peralta in front of you.", "Student", "U2"),
  new newPerson("Higher", "https://pbs.twimg.com/profile_images/1297284021555208198/tlWsDTtw_400x400.jpg",
  "Hajar Akkouh", "1002381@gmail.com", "BintErn3t", "Okay, fine! I was three minutes late! I'm sorry for doing one thing wrong.", "Student", "U3"),
  new newPerson("fkorrie", "https://i.imgur.com/ligKpsd.png",
  "Feyo Korenhof", "fkorrie@gmail.com", "R0L3suCks", "Oh. It's more than one thing.", "Student", "U4"),
  new newPerson("thrytas", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/03/0360da6ad433a2702c6a4d50472cf6cc7005a611_full.jpg",
  "Victor Roskam", "thrytas@gmail.com", "Tr4pF3l1X", "Eh oh", "Student", "U5"),
  new newPerson("Rikkuwu", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/ae/ae6b617396e7f0dbc15d8a949cb04e490252ec36_full.jpg",
  "Tjebbe Gumbs", "Tjebbe.Gumbs@gmail.com", "N0Fu5ry", "Let's start with the christoff murder.", "Student", "U6"),
  new newPerson("PinterestGerda", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/55/55060f51b00415567c325c7c2215ad3306b2d8a1_full.jpg",
  "Esra Heersink", "Esra.Heersink@gmail.com", "P1nt83sD", "It was an amazing solve. I got him to confess in twenty minutes.", "Student", "U7"),
  new newPerson("haaijer", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1406990/3af5ae959ae7cf0f22f89d23d4dbcf526bbf6883.gif",
  "Jildou Reuvekamp", "Jildou.Reuvekamp@gmail.com", "JAIndfK*9asid", "You also mislabeled the evidence, so that confession is worthless if the sergeant hadn't caught your mistake. Here are 3 cases with sloppy paperwork. Here are two pictures. One is your locker, the other is a garbage dump in the Philippines. Can you tell which is which?", "Student", "U8"),
  new newPerson("Heelvaag", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/23/237936f8d24095912f2506084d98ef19f2357880_full.jpg",
  "Vage Namen", "1123912@gmail.com", "vaagWW", "That one is the dump?", "Student", "U9"),
  new newPerson("Pluutonium", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1299120/2a5aceba66d2771b8046e4172c6919220c9460d6.gif",
  "Luuk Pouwels", "pluutonium@gmail.com", "Alisayt5475843y5t", "They are both your locker.", "Student", "U10"),
  new newPerson("Lugia", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/33/334f0534a72ed57a634a4e99b276a7b598a5d6a4_full.jpg",
  "Latifa Monshouwer", "Latifa.Monshouwer@gmail.com", "Lugi4asd", "God, I should have guessed that. He's good.", "Student", "U11"),
  new newPerson("BakaMitai", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/28/2864707778af218ffa4e95223dd993d4ba314cfd_full.jpg",
  "Willempje Laarhoven", "Willempje.Laarhoven@gmail.com", "KodoM0naN0ne", "This folder is labeled 'Undies, dirty'.", "Student", "U12"),
  new newPerson("Beethoven", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/2d/2dce8682cd3bbfb9f3e0dec55053402464754d62_full.jpg",
  "Ludwig van Beethoven", "Beethovenvanludwig@gmail.com", "FurEl1Se", "So I won't confuse them with 'Undies, clean'. Also who cares about all these rules! I have more felony arrests than any other detective here.", "Student", "U13"),
  new newPerson("Rikku", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1299120/df5018736f965aeb7f88e2f0bb90121912384f48.gif",
  "Rick Slingerland", "rikkuwu@gmail.com", "Ball3r3", "You also have more mice living in your desk than any other detective.", "Student", "U14"),
  new newPerson("Stijnnn", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1097150/2fb8fd91cbdc6f8a3f630579a0ee479d5c22505f.gif",
  "Stijn van der Kolk", "Kolkderstijn@gmail.com", "C3++l1fe", "*gasps* Algernon! You guys. Algernon is back!", "Student", "U15"),
  new newPerson("Freek", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/8e/8e0df63dc59af3ca24330a684922c2316487f3a4_full.jpg",
  "Freek Fonk", "Freekstudenten@gmail.com", "Alig4t0R", "Get rid of the mouse and get your act together! Now!", "Student", "U16"),
  new newPerson("noodle_munch", "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/50/50c397fa4aea55ac66dbebbb85f24064f5547eb9_full.jpg",
  "Melissa Kross", "MKross2021@gmail.com", "K4nn4DrAg0n", "He's grumpy!", "Student", "U17"),
  new newPerson("Bob", "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg", 
  "Bob de Sponsor", "Bob.sponsor@gmail.com", "Bob123", "Kunnen wij het betalen!", "Sponsor", "U18")];
  JSONString = `${JSON.stringify(users)}`;
  WriteFile(JSONString, "Models", "UsersListJSON.json");
}

@Component({
  name: "Home",
  components: {
    ActionBarTop,
    ActionBarBottom,
    Login,
    Posts,
    AccountAanvragen,
    ActionBarTopLogIn,
    AccountAanmaken
  }
})
export default class Home extends Vue {
  msg: string = "Home";
  loggedIn: boolean = AppSettings.getBoolean("Loggedin");
  accountaanvragen: boolean = false;
  accountaanmaken: boolean = false;
  loggedinprofile: string = "";

  beforeMount(){
    try {
        if (FileExist("Models", "PostJSON.json") != true){
          let basicPost = new Post("0", 2, "Hajar Akkouh" ,"~/Images/welcome.png" , "Welkom bij de Team Phidippides Chat App!", [])
          let postArray: Array<Post> = [basicPost];      
          let postString: string = JSON.stringify(postArray)
          WriteFile(postString, "Models", "PostJSON.json");
          console.log("post as a string: " + postString)
          console.log(ReadFileSync("Models", "PostJSON.json"));
          console.log("File not found, created new one!");
          console.log(JSON.parse(ReadFileSync("Models", "PostJSON.json")));
        }
      }
      catch (error){
      console.log("an error has occured") 
      }
  }

  profilepicture(){
    return AppSettings.getString('LoggedinPFPUrl');
  }

  login() {
    if (AppSettings.getBoolean("Loggedin") == true){
      AppSettings.setBoolean("Loggedin", false);
      this.loggedIn = false;
      AppSettings.remove("LoggedinUsername");
      AppSettings.remove("LoggedinPFPUrl");
      AppSettings.remove("LoggedinName");
      AppSettings.remove("LoggedinEmail");
      AppSettings.remove("LoggedinPassword");
      AppSettings.remove("LoggedinDescription");
      AppSettings.remove("LoggedinRole");
      AppSettings.remove("LoggedinID");
      this.loggedinprofile = "";
    }
    else{
      AppSettings.setBoolean("Loggedin", true);
      this.loggedIn = true;
      this.loggedinprofile = this.profilepicture();
    }
  }
  acaangevraagd(){
    this.accountaanvragen = !this.accountaanvragen;
  }
  accountaangemaaktmethod(){
    this.accountaanmaken = !this.accountaanmaken;
  }
}
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles

.profile-pic {
    border-radius: 100;
    border-width: 0;
    border-color: #555fa4;
    object-fit: scale-down;
    margin-left: 89%;
    margin-top: 0.2%;
  }

.logoutbutton{
  display: inline-block;
  color: rgb(255, 255, 255);
  border-radius: 10%;
  background-color: rgb(57, 55, 121);
  font-family: Arial;
  font-size: 10;
  font-weight: bold;
  width: 60;
  height: 20;
  margin-left: 40;
  margin-top: -4;
  box-shadow: 6px 6px 6px rgba(0,0,0,155);
}

.logoutbutton:active{
    color:white;
    background-color: rgb(21, 18, 110);
    box-shadow: 6px 6px 6px rgba(0,0,0,200);
}

.fas {
  @include colorize($color: accent);
}
</style>
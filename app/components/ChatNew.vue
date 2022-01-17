<template>
    <AbsoluteLayout>
        <!-- text inputs field for user & view for message -->
        <!-- TODO: create function to check if user exists -->
        <Gridlayout rows="1*, auto, 1*, 1*, 7*" marginTop="10%" height="100%" width="100%" class="backgroundChats">
            <TextField row="0" class="textfield" returnKeyType="done" autocapitalizationType="none" ref="Name" hint="Gebruikersnaam" @returnPress="ClearSuggestions()" @textChange="changeText"></TextField>
            <ScrollView class="textfield" row="1" ref="scrollView" width="92%">
                <StackLayout width="92%">
                    <Gridlayout v-for="suggestion in suggestions" :key="suggestion.username" rows="auto" columns="auto, auto" padding="5" @tap="SuggestionClick(suggestion.username)">
                        <Image column="0" :src="suggestion.pfp_url" class="chat-profile-pic"></Image>
                        <Label column="2" :text="suggestion.username" verticalAlignment="center" marginLeft="10" fontWeight="bold" fontsize="18"/>
                    </Gridlayout>
                </StackLayout>
            </ScrollView>
            <TextField row="2" class="textfield" ref="Message" hint="Bericht" returnKeyType="send" @returnPress="openNewChat($event)" @tap="ClearSuggestions()"></TextField>
            <Button row="3" class="verzendbutton" text="Verzenden" @tap="openNewChat($event)"></Button>
        </GridLayout>
        <!-- actionbars top/bottom -->
        <GridLayout rows="2*, 12*, *" height="100%" width=100%>
            <ActionBarTop row="0"/>
            <ActionBarBottom row="2" />
        </GridLayout>
        <!-- back button -->
        <GridLayout columns="60, 410, 60" rows="50, 720, 60">
            <Image
            src="~/Images/back_btn.png"
            row="0"
            col="0"
            marginTop="10"
            @tap="goBack"
            ></Image>
      </GridLayout>
    </AbsoluteLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";
import { Button, EventData, GridLayout, ImageAsset, ScrollView, TapGestureEventData, TextField, TextView, SearchBar } from "@nativescript/core";
import ActionBarTop from "./ActionBars/ActionBarTop.vue";
import ActionBarBottom from "./ActionBars/ActionBarBottom.vue";
import * as AppSettings from '@nativescript/core/application-settings';
import Message from "@/Models/Message";
import Chat from "@/Models/Chat";
import Chats from "@/components/Chats.vue";
import ChatDisplay from "./ChatDisplay.vue";
import {WriteFile, ReadFile, ReadFileSync} from "@/Models/FileSystemFunctions";
import {Levenshtein} from "@/Models/Levenshtein";
import newPerson from "~/Models/newPerson";

@Component({
    name: "ChatNew",
    components: {
        ActionBarTop,
        ActionBarBottom
    }
})

export default class ChatNew extends Vue {
    msg: string = "ChatNew";
    JSONString: string = "";
    JSONStringFile: string = "";
    PushChat!: Chat;
    @Prop() onAddNewChat!: any;
    suggestions: Array<newPerson> = [];
    users: Array<newPerson> = [];
    // function to go back to previous screen
    goBack() {
        if (this.$modal) this.$modal.close();
    }

    onClose() {
        console.log("test print");
        console.log("Dit is de Chat die gepusht wordt: " + this.PushChat)
        this.onAddNewChat(this.PushChat);
        if (this.$modal) this.$modal.close();
    }
    // TODO: add current time
    // TODO: create ID system
    openNewChat(event: TapGestureEventData) {
        let rawName: TextField = (this.$refs.Name as any).nativeView as TextField;
        let name = rawName.text.trim()
        let rawtxt: TextView = (this.$refs.Message as any).nativeView as TextView;
        let txt = rawtxt.text.trim()
        let user!: any;
        let tempID!: string;
        let tempURL!: string;

        if (txt !== null && txt !== "" && name !== null && name !== "") {

            for(user in this.users){
                console.log(this.users[user].username)
                if(this.users[user].username == name){
                    tempID = this.users[user].ID;
                    tempURL = this.users[user].pfp_url;
                    console.log("found")
                    break;
                }
                tempID = `${this.getRandomInt(99999999)}`;
                tempURL = "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg"
            }

            var d = new Date();
            let uur: string = "";
            let minuten: string = "";
            let dag: string = "";
            let maand: string = "";

            if(d.getHours() < 10){
            uur = `0${d.getHours()}`
            }
            else{uur = `${d.getHours()}`}

            if(d.getMinutes() < 10){
            minuten = `0${d.getMinutes()}`
            }
            else{minuten = `${d.getMinutes()}`}        

            if(d.getDate() < 10){
            dag = `0${d.getDate()}`
            }
            else{dag = `${d.getDate()}`}

            if((d.getMonth() + 1) < 10){
            maand = `0${(d.getMonth() + 1)}`
            }
            else{maand = `${(d.getMonth() + 1)}`}        

            let tijd: string = `${uur}:${minuten} ${dag}-${maand}-${d.getFullYear()}`
            let tempIDChat = `${this.getRandomInt(99999999)}`
            let newMessage = new Message(`${this.getRandomInt(99999999)}`, 5, null, null, txt, AppSettings.getString("LoggedinID"), tempID)
            let newchat = new Chat(tempIDChat, AppSettings.getString("LoggedinID"), tempID, name, tempURL, [newMessage], txt, tijd)
            let ChatsArray : Array<any>;
            //Chat information to JSON string
            this.PushChat = newchat;
            console.log(this.PushChat)
            this.JSONString = `${JSON.stringify(newchat)}`;
            console.log(`newchat: ${this.JSONString}`);

            // Adding JSON name of chat to db of all chat names
            ChatsArray = JSON.parse(ReadFileSync("Models", "ChatsJSON.json"));
            ChatsArray.push(`${tempIDChat}.json`)
            this.JSONStringFile = JSON.stringify(ChatsArray)
            console.log(`AllChats2: ${ChatsArray}`);
            WriteFile(this.JSONStringFile, "Models", "ChatsJSON.json")
            console.log(ReadFileSync("Models", "ChatsJSON.json"))

            WriteFile(this.JSONString, "Models", `${tempIDChat}.json`);
            console.log(ReadFileSync("Models", `${tempIDChat}.json`))
            this.onClose();
        }
    }
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
    beforeMount() {
        var file;
        var FileContentChats = JSON.parse(ReadFileSync("Models", "UsersListJSON.json"))
        console.log(FileContentChats)
        for (file in FileContentChats) {
            console.log(file)
            console.log(`${FileContentChats[file]}`)
            this.users.push(FileContentChats[file])
        }
    }
    changeText(){
        let rawName: TextField = (this.$refs.Name as any).nativeView as TextField;
        let Name: string = rawName.text.toLowerCase();
        let Names!: string;
        console.log(rawName.text)
        this.suggestions = []

        let names = this.users;

        if(Name.length != 0){
            for(Names in names){
                console.log(names[Names].username.toLowerCase())
                console.log(Levenshtein(Name, names[Names].username.toLowerCase()))
                if(Levenshtein(Name.trim(), names[Names].username.toLowerCase().trim()) < (Name.length/2) || (names[Names].username.toLowerCase().trim().includes(Name.toLowerCase().trim()))){
                    if(this.suggestions.length < 3){
                        this.suggestions.push(names[Names])
                        console.log(`these are the suggestions 1: ${this.suggestions}`)
                    }
                }
            }
        }
        console.log(`these are the suggestions 2: ${this.suggestions}`)
    }
    SuggestionClick(suggestionname: string){
       let rawName: TextField = (this.$refs.Name as any).nativeView as TextField;
       rawName.text =  suggestionname;
       this.suggestions = [];
       rawName.dismissSoftInput();
    }
    ClearSuggestions(){
        this.suggestions = [];
    }
}
</script>

<style lang="scss" scoped>
.textfield {
  color: black;
  font-size: 16;
  background-color: rgb(207, 207, 207);
  border-radius: 10;
  padding: 10;
  border-bottom-width: 1;
  border-bottom-color: transparent;
}
.verzendbutton{
    color:rgb(255, 255, 255);
    border-radius: 75%;
    background-color: #CD1045;
    font-family: Arial;
    font-size: 30%;
    font-weight:bold;
    width: 45%;
    padding: 5;
}
.verzendbutton:active{
    color:white;
    background-color: #a00c36;
}
.backgroundChats {
  background-color: rgb(239, 239, 239);
}
.chat-profile-pic {
  width: 40;
  height: 40;
  border-radius: 90;
  border-width: 1;
  border-color: #757575;
  object-fit: scale-down;
  background-color: #ffffff;
}
</style>

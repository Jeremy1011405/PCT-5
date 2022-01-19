<template>
  <AbsoluteLayout>
        <Gridlayout rows="1*, 1*, 1*, 4*" marginTop="10%" height="100%" width="100%">
            <TextField row="1" class="textfield" returnKeyType="next" autocapitalizationType="none" ref="Image" hint="Plak hier uw foto" @returnPress="imagePost($event)"></TextField>
            <TextField row="0" class="textfield" maxLength=150 ref="Beschrijving" hint="Type hier uw beschrijving" returnKeyType="done" @returnPress="beschrijvingPost($event)"></TextField>
            <Button row="2" class="toevoegenbutton" text="Toevoegen" @tap="writeJSON($event)"></Button>
        </GridLayout>
        <GridLayout rows="2*, 12*, *" height="100%" width="100%">
            <ActionBarTop row="0" />
            <ActionBarBottom row="2" />
      </GridLayout>
    <GridLayout columns="60, 410, 60" rows="50, 720, 60">
        <Image
          src="~/Images/back_btn.png"
          row="0"
          col="0"
          marginTop="10"
          @tap="goBack()"
        ></Image>
    </GridLayout>
  </AbsoluteLayout>  
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import ActionBarTop from "./ActionBars/ActionBarTop.vue";
import ActionBarBottom from "./ActionBars/ActionBarBottom.vue";
import Post from "@/Models/Post";
import Comment from "@/Models/Comment";
import newPerson from "@/Models/newPerson";
import { Component, Prop } from "vue-property-decorator";
import { TextField, TapGestureEventData  } from "@nativescript/core";
import {WriteFile, ReadFile, ReadFileSync, FileExist} from "@/Models/FileSystemFunctions";
import * as AppSettings from '@nativescript/core/application-settings';

@Component({
  name: "AddPost",
  components: {
    ActionBarTop,
    ActionBarBottom
  }
})

export default class AddPost extends Vue{
  newPost = new Post("-",1,"","","", [],[]);
  posts: Array<any> = [];
  currentUser!: newPerson;
  @Prop()! onAddPost: any;
  defaultComment!: Comment;

  beforeMount(){
    // de current user is nodig om de correcte username bij de post te koppelen
    this.currentUser = new newPerson(
      AppSettings.getString("LoggedinUsername"), 
      AppSettings.getString("LoggedinPFPUrl"),
      AppSettings.getString("LoggedinName"),
      AppSettings.getString("LoggedinEmail"),
      AppSettings.getString("LoggedinPassword"),
      AppSettings.getString("LoggedinDescription"),
      AppSettings.getString("LoggedinRole"),
      AppSettings.getString("LoggedinID")
    );   

    // Hier lees ik de Post.jason voor de posts :) 
    try{
      if (FileExist("Models", "PostJSON.json") == true){
        var FileContent = ReadFileSync("Models", "PostJSON.json");
        var JSONFileContent = JSON.parse(FileContent);
        var post;
        for (post in JSONFileContent){
          this.posts.push(JSONFileContent[post]);
          console.log(this.posts)
        }
        console.log("Test: " + JSONFileContent)
      }
    }
    catch (error)
    { 
      console.log("get rekt")
    }
  }

  // ik haal hier de foto van de post die wordt ingetikt in één van de textfields
  imagePost(args: TapGestureEventData){
    this.newPost.type = 2;
    let imageInput: TextField = (this.$refs.Image as any).nativeView as TextField;
    this.newPost.image = imageInput.text;
    this.newPost.id = this.idNewPost();
    console.log(imageInput)
    // do something
  }

  // ik haal hier de beschrijving van de post die wordt ingetikt in één van de textfields
  beschrijvingPost(args: TapGestureEventData){
    let beschrijving: TextField = (this.$refs.Beschrijving as any).nativeView as TextField;
    this.newPost.footer = beschrijving.text;
    console.log(beschrijving)
  }

  timeStampForComment(): String{
    var d = new Date();
    let uur: string = "";
    let minuten: string = "";
    let dag: string = "";
    let maand: string = "";
    // sorry dat ik je code steel victor ik ging dit sws ook implementeren voor comments
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
    
    return `${uur}:${minuten} ${dag}-${maand}-${d.getFullYear()}`;   
  }

  writeJSON(args: TapGestureEventData){
    var idComment = this.idNewPost() + "-0"
    this.defaultComment = new Comment(idComment, this.currentUser.username, this.newPost.footer, [], this.timeStampForComment())
    this.newPost.username = this.currentUser.name;
    this.newPost.comments.push(this.defaultComment);
    console.log(this.newPost)
    try{
      if (this.newPost.image != "" && this.newPost.footer != "") {
        // de nieuwe post toevoegen aan de posts array en dan vertalen naar jason taal

        console.log(this.newPost)
        this.posts.push(this.newPost)
        var JSONString = `${JSON.stringify(this.newPost)}`;
        console.log(`newpost: ${JSONString}`);

        // de nieuwe versie van alle posts weer schrijven naar de posts
        var JSONStringFile = JSON.stringify(this.posts)
        console.log(JSONStringFile)
        console.log(`Alle posts: ${this.posts}`);
        WriteFile(JSONStringFile, "Models", "PostJSON.json")
        console.log(ReadFileSync("Models", "PostJSON.json"))

        this.onClose();
      }
    }
    catch (error){
      console.log("error found: "+ error)
    }
  }

  idNewPost(): String{
    return "" + this.posts.length;
  }

  onClose() {
    console.log("test print");
    console.log("Dit is de post die gepusht wordt: " + this.newPost)
    this.onAddPost(this.newPost);
    if (this.$modal) this.$modal.close();
  }

  goBack() {
    if (this.$modal) this.$modal.close();
  } 
} 


</script>

<style lang="scss" scoped>

.textfield{
  color: black;
  font-size: 16;
  background-color: rgb(207, 207, 207);
  border-radius: 10;
  padding: 10;
  border-bottom-width: 1;
  border-bottom-color: transparent; 
}

.toevoegenbutton{
  color:rgb(255, 255, 255);
  border-radius: 75%;
  background-color: #CD1045;
  font-family: Arial;
  font-size: 30%;
  font-weight:bold;
  width: 45%;
  padding: 5;
}
</style>
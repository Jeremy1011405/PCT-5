<template>
  <GridLayout>
    <GridLayout row="0" height="100%" width="100%" class="posts-container">
      <ScrollView height="100%" width="95%" class="posts-listview">
        <StackLayout>
          <!-- Button that executes the goToProfiel() function -->
          <Button
            class="-outline -rounded-sm"
            text="Mijn Profiel"
            fontSize="20"
            marginTop="70"
            padding="5"
            @tap="goToProfiel()"
          ></Button>
          <Button
            class="-outline -rounded-sm"
            text="Chats"
            width="20%"
            height="5%"
            fontsize="20"
            padding="5"
            @tap="goToChats()"
          ></Button>
          <GridLayout row="0">
            <Label
              :text="`Welkom op PCT-5, ${this.currentUser.name.split(' ')[0]}`"
              fontSize="25"
              horizontalAlignment="center"
            ></Label>
          </GridLayout>
          <GridLayout
            v-for="post in posts"
            :key="post.id"
            rows="*, auto, auto, auto, *"
            class="post-container"
          >
            <!-- Username -->
            <GridLayout columns="1*, 7*, *" row="0" class="post-username">
              <Image
                col="0"
                :src="profilePicture(post.username)"
                class="post-profile-picture"
              >
              </Image>
              <Label :text="post.username" col="1"></Label>
              <!-- Remove Post Button -->
              <Image
                col="2"
                v-show="showRemove(post.username)"
                src="~/Images/remove_btn.png"
                class="post-remove-button"
                @tap="deletePost(post)"
              >
              </Image>
            </GridLayout>
            <!-- Image -->
            <GridLayout row="1" class="post-body">
              <Image :src="post.image" class="post-image"> </Image>
            </GridLayout>
            <!-- Footer van posts -->
            <GridLayout row="3" class="post-footer">
              <Label
                :text="[post.username + ': ' + post.footer]"
                textWrap="true"
              ></Label>
            </GridLayout>
            <!-- Heart -->
            <GridLayout
              columns="*, 4*"
              row="2"
              class="post-heart"
              width="100%"
              @tap="likePost($event, post)"
            >
              <Image
                src="~/Images/heart-empty.png"
                v-show="!hasLiked(post)"
                TintColor="black"
                col="0"
              />
              <Label :text="[post.likes.length + ' likes']" col="1"></Label>
              <Image
                src="~/Images/heart-full.png"
                v-show="hasLiked(post)"
                TintColor="black"
                col="0"
              />
            </GridLayout>
            <!-- Comments preview (take first/last/most liked / ?) -->
            <StackLayout
              row="4"
              class="post-footer"
              @tap="openComments($event, post)"
            >
              <StackLayout class="post-comments">
                <Label
                  v-for="comment in post.comments.slice(0, 2)"
                  :key="comment.id"
                  :text="`${comment.username}: ${comment.info}`"
                ></Label>
                <Label v-show="post.comments.length > 2" text="...."></Label>
              </StackLayout>
            </StackLayout>
          </GridLayout>
          <Label height="70"> </Label>
        </StackLayout>
      </ScrollView>
    </GridLayout>
    <GridLayout
      columns="5*, 4*, 2*"
      rows="2*, 12*, 1*"
      height="94%"
      width="100%"
    >
      <Image
        src="~/Images/add_btn.png"
        class="button-image"
        horizontalAlignment="right"
        marginBottom="50"
        row="2"
        col="2"
        @tap="MakePost()"
      >
      </Image>
    </GridLayout>
  </GridLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { Component, Prop } from "vue-property-decorator";
import {
  FormattedString,
  TapGestureEventData,
  Label,
  Span
} from "@nativescript/core";
import Post from "@/Models/Post";
import Chat from "@/Models/Chat";
import Message from "@/Models/Message";
import Comments from "@/components/Comments.vue";
import AddPost from "@/components/AddPost.vue";
import Chats from "@/components/Chats.vue";
import Profiel from "@/components/Profiel.vue";
import newPerson from "@/Models/newPerson";
import ActionBarTop from "./ActionBars/ActionBarTop.vue";
import ActionBarBottom from "./ActionBars/ActionBarBottom.vue";
import {
  WriteFile,
  ReadFileSync,
  FileExist
} from "@/Models/FileSystemFunctions";
import * as AppSettings from "@nativescript/core/application-settings";

// import { mapActions, mapGetters } from "vuex";

@Component({
  name: "Posts",
  components: {
    Comments,
    AddPost,
    Chats,
    Profiel,
    ActionBarTop,
    ActionBarBottom
  }
})
export default class Posts extends Vue {
  @Prop() currentUser!: newPerson;
  JSONString: string = "";
  JSONStringFile: string = "";
  posts: Array<any> = [];
  users: Array<any> = [];

  beforeMount() {
    // reading posts from jason
    try {
      if (FileExist("Models", "PostJSON.json") == true) {
        var FileContent = ReadFileSync("Models", "PostJSON.json");
        var JSONFileContent = JSON.parse(FileContent);
        var post;
        for (post in JSONFileContent) {
          this.posts.push(JSONFileContent[post]);
          console.log(this.posts);
        }
        console.log("Test: " + JSONFileContent);
      }
    } catch (error) {
      console.log("get rekt");
    }
    console.log(this.currentUser.username);

    // reading all users from jason for: liking posts and adding a post
    var user;
    var FileContentUser = JSON.parse(
      ReadFileSync("Models", "UsersListJSON.json")
    );
    console.log(FileContentUser);
    for (user in FileContentUser) {
      console.log(user);
      console.log(`${FileContentUser[user]}`);
      this.users.push(`${FileContentUser[user]}`);
    }
  }

  // reading profilepicture of every user so I can display it in a post
  profilePicture(username: String): String {
    var user;
    var pfp_url = "";
    for (user in this.users) {
      if (username == this.users[user].username) {
        pfp_url = this.users[user].pfp_url;
      }
    }
    return pfp_url;
  }

  // check if a post is of the current logged in User. if true -> you got the option to delete a post, if false -> no option
  showRemove(username: String): Boolean {
    // var user;
    // for (user in this.users) {
    //   if (username == this.currentUser.name) {
    //     return true;
    //   } else if (this.currentUser.role != "Student") {
    //     return false;
    //   }
    // }
    // return false;
    return username == this.currentUser.name;
  }

  // displays add post button if you are not a sponsor
  showAdd(): Boolean {
    if (this.currentUser.role == "Student") {
      return true;
    }
    return false;
  }

  // this function checks if a user liked a post or not
  hasLiked(post: Post) {
    if (post.likes.indexOf(this.currentUser.username) != -1) {
      return true;
    }
    return false;
  }

  likePost(args: TapGestureEventData, post: Post) {
    let id = this.currentUser.username;
    // Check of het al geliked is (anders hartje weer weghalen)
    let index = post.likes.indexOf(id);
    if (index != -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(id);
    }
  }

  // deletes post from post screen
  deletePost(post: Post) {
    let temp = this.posts.filter((p: Post) => {
      return p.id != post.id;
    });
    this.posts = [...temp];

    // Save to json..
    var JSONStringFile = JSON.stringify(this.posts);
    WriteFile(JSONStringFile, "Models", "PostJSON.json");
  }

  // page for adding post
  MakePost(args: TapGestureEventData) {
    this.$showModal(AddPost, {
      fullscreen: true,
      props: {
        onAddPost: this.onAddPost,
        currentUser: this.currentUser
      }
    });
  }

  onAddPost(postTemp: Post) {
    console.log("List push activeert");
    console.log("Post die gepusht wordt: " + postTemp);
    this.posts.push(postTemp);
    this.posts = this.posts.slice();
  }

  // Open your profile page
  goToProfiel() {
    this.$showModal(Profiel, {
      fullscreen: true
    });
  }

  // A mini before mount for chats screen
  goToChats() {
    try {
      if (FileExist("Models", "ChatsJSON.json") != true){
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
        let newMessage1 = new Message("FirstMessage1", 5, null, null, "Welkom bij de team Phidippides app!", AppSettings.getString("LoggedinID"), "ChatBot")
        let newMessage2 = new Message("FirstMessage2", 5, null, null, "Heb je vragen of opmerkingen?", AppSettings.getString("LoggedinID"), "ChatBot")
        let newMessage3 = new Message("FirstMessage3", 5, null, null, "Neem dan contact op met de beheerder.", AppSettings.getString("LoggedinID"), "ChatBot")
        let newchat = new Chat("FirstChat", "ChatBot", AppSettings.getString("LoggedinID"), "Team Phidippides", "https://i.ibb.co/Wf0TJj3/ic-launcher.png", [newMessage1, newMessage2, newMessage3], "Welkom bij de team Phidippides app! \n heb je vragen of opmerkingen? \n Neem dan contact op met de berheerder.", tijd)
        let ChatsArray: Array<any> = ["FirstChat.json"];
        this.JSONString = JSON.stringify(newchat);
        this.JSONStringFile = JSON.stringify(ChatsArray);
        WriteFile(this.JSONString, "Models", "FirstChat.json");
        WriteFile(this.JSONStringFile, "Models", "ChatsJSON.json");
        console.log(this.JSONStringFile);
        console.log(this.JSONString);
        console.log(ReadFileSync("Models", "ChatsJSON.json"));
        console.log("File not found, created new one!");
      }
    } catch (error) {
      console.log("an error has occured");
    }

    this.$showModal(Chats, {
      fullscreen: true
    });
  }

  // opening comments of a post
  openComments($event: TapGestureEventData, post: Post) {
    try {
      if (FileExist("Models", "CommentsJSON.json") != true) {
        console.log("File not found, created new one!");
        console.log(JSON.parse(ReadFileSync("Models", "PostJSON.json")));
      }
    } catch (error) {
      console.log("an error has occured");
    }
    console.log(post.type);
    this.$showModal(Comments, {
      fullscreen: true,
      props: {
        post: post
      }
    });
  }
}
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.post-remove-button {
  height: 20;
  width: 20;
}

.posts-container {
  background-color: rgb(239, 239, 239);
}

.post-image {
  background-color: white;
  max-height: 1500px;
  max-width: 1400px;
}

.button-image {
  height: 50;
  width: 50;
}

.post-heart {
  background-color: white;
  height: 25;
  width: 25;
  float: left;
}

.posts-listview {
  border-radius: 20;
}

.post-body {
  border-color: rgb(239, 239, 239);
  border-width: 4px;
  image {
    width: auto;
    height: 550px;
  }
}

.add-post {
  bottom: 500px;
  height: 50;
  width: 50;
}

.post-container {
  height: auto;
  width: auto;
  margin-right: 10;
  margin-left: 10;
  border-color: rgb(204, 200, 200);
  margin-top: 20;
  border-radius: 10;
  border-width: 2px;
}

.post-username {
  font-size: 16;
  background-color: rgb(255, 255, 255);
  border-top-right-radius: 10;
  border-top-left-radius: 10;
  border-bottom-width: 2px;
  border-color: rgb(204, 200, 200);
  border-bottom-color: white;
  label {
    color: black;
  }
  padding: 10;
}

.post-profile-picture {
  border-radius: 90;
  border-width: 1;
  border-color: #757575;
  object-fit: scale-down;
  height: 35;
  width: 35;
}

.logoutbutton {
  display: inline-block;
  color: rgb(255, 255, 255);
  border-radius: 10%;
  background-color: rgb(57, 55, 121);
  font-family: Arial;
  font-size: 10;
  font-weight: bold;
  width: 60;
  height: 20;
  margin-left: -250;
  margin-top: -500;
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 155);
}

.post-footer {
  font-size: 14;
  background-color: rgb(255, 255, 255);
  padding: 10;
  label {
    color: black;
  }
  padding: 10;
}

.post-comments {
  font-size: 14;
  background-color: rgb(255, 255, 255);
  padding: 10;
}
</style>

The Angular DevHive front-end contains a lot of components. We can separate them in two groups:

[Pages](#pages) - components that make up a whole page
- [`post-page`](#post-page)
- [`comment-page`](#comment-page)
- [`feed`](#feed)
- [`login`](#login)
- [`register`](#register)
- [`not-found`](#not-found)
- [`profile`](#profile)
- [`profile-settings`](#profile-settings)
- [`admin-panel-page`](#admin-panel-page)

Elements - components, that are added inside an existing page
- `post`
- `post-attachment`
- `comment`
- `error-bar`
- `success-bar`
- `loading`

Refer to the API and [API Endpoints](https://github.com/Team-Kaleidoscope/DevHive/wiki/API-Endpoints#getposts) wiki page for more info on how many of the components function.

# Pages

## post-page

The post-page is used to contain a whole post, it's comments and post editing buttons.

It's routed to `post/:id`, meaning links look like: `http://localhost:4200/post/850d0655-72cb-4477-b69b-35e8645db266`.
- You can access it, even if you aren't logged in
- If a given post doesn't exist (the id in the link is invalid), the user gets redirected to the `not-found` page

The component fetches the post with the id in the link, then fetches all comments, and finally, if the user is logged in and is the creator of the post, it shows the edit and delete buttons.
- With the edit button you can change the post's attachments and message. Submitting an edit is done by pressing the `Edit Post` button again or pressing enter in the `New Message` field.
- The delete button doesn't have a warning message, **so be careful when deleting a post!**

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/post-page.png)
![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/post-page-with-comments.png)

</details>

## comment-page

The comment-page is used for containing a comment and it's editing buttons. This is the only place where you can edit a comment (if it's made by you).

It's routing is configured to `comment/:id`, meaning you go to it via links like: `http://localhost:4200/comment/1cc9773f-8d9a-4bfd-83ca-2099dc787a39`.
- Users can access it, even if not logged in
- On invalid id, the user gets redirected to `not-found`

The component fetches the comment with the id from the link and if the user is logged in and is it's creator, shows the edit and delete buttons.
- You can edit a comments message and submitting the change is done by either pressing `Edit Comment` again or pressing enter in the `New Message` field.
- Deletion doesn't have a warning message, **so be careful when deciding to delete a comment!**

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/comment-page.png)

</details>

## feed

The feed is the main page of the application. It contains the feed posts: the latest posts of your friends. Here you also make your posts and can view and logout from your profile.

It's routed to the website root ` `, meaning it's located at `http://localhost:4200` (you can also have a last forward-slash: `http://localhost:4200/`).
- If you aren't logged in, you're gonna get redirected to the login page

The feed fetches the user info, showing it on the left side bar, or showing just the profile icon next to the create post field, and fetches his feed.
- Creating a post is done by typing in your message and (optionally) adding attachments to it via the paperclip (button). To submit your new post, you need to press enter in the `What's on your mind?` input field.

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/feed.png)
![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/creating-post.png)

</details>

## login

This page is used for logging into your account. It also has a button redirect to the register page and has an error bar that shows up when you've entered bad credentials.

It's routed to `login`, meaning you access it from `http://localhost:4200/login`
- It can be accessed by anyone and everyone

The login page [sends a request](https://github.com/Team-Kaleidoscope/DevHive/wiki/API-Endpoints#login) to the API, and if it returns a successful result, the result [token](https://github.com/Team-Kaleidoscope/DevHive/wiki/Authentication) is stored in session storage and you get redirected to the feed.
- You can log in another account, while already logged in. The session storage token just gets overwritten.
- On unsuccessful login, you get shown an error bar and don't get redirected

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/login.png)

</details>

## register

This page is used for registering a new account. It also has a button to redirect to the login page and has an error bar that shows up when you've entered bad values.

It's routed to `register`, meaning you access it from `http://localhost:4200/register`
- It can be accessed by anyone and everyone

The register page [sends a request](https://github.com/Team-Kaleidoscope/DevHive/wiki/API-Endpoints#register) to the API, and if it returns a successful result, the result [token](https://github.com/Team-Kaleidoscope/DevHive/wiki/Authentication) is stored in session storage and you get redirected to the feed.
- You can register another account, while already logged in. The session storage token just gets overwritten.
- On unsuccessful register, you get shown an error bar and don't get redirected

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/register.png)

</details>

## not-found

The "not-found" page is a static page that is shown when trying to access a nonexistent link, or by being redirect to it's page.

This component has two routings: `not-found` and `**`, meaning you access it from `http://localhost:4200/not-found` or from any invalid link
- Some page components redirect you to this page, if they couldn't load something from API

## profile

This page is used for showing a profile's info and/or action buttons. 

It's routed to `profile/:username`, meaning you access it from `http://localhost:4200/profile/test`
- It can be access by anyone and everyone
- If a given profile doesn't exist (the username in the link is invalid), the user gets redirected to the `not-found` page

The profile page [sends a request](https://github.com/Team-Kaleidoscope/DevHive/wiki/API-Endpoints#getuser) to the API, and if it returns a successful result, the result user is shown.
- You can log in another account, while already logged in. The session storage token just gets overwritten.
- On unsuccessful login, you get shown an error bar and don't get redirected
- If you are on the profile page of the logged in user, you're gonna get access to

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/your-profile-page.png)
![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/another-user-logged-in.png)

</details>

## profile-settings

This page is used for showing a profile's settings and for doing changes to the profile. 

It's routed to `profile/:username/settings`, meaning you access it from `http://localhost:4200/profile/test/settings`
- It can only be accessed if the logged-in user and the username in the link match

When you've made your profile modifications, it [sends a request](https://github.com/Team-Kaleidoscope/DevHive/wiki/API-Endpoints#update-user-by-id) to the API. If it returns a successful result, in some cases the page reloads (to show you the new values for your profile), but usually it just shows you the success bar.

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/your-settings-page.png)
![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/edit.png)

</details>

## profile-settings

This page is used for showing the admin DevHive settings and for doing changes to the whole database.

It's routed to `admin-panel`, meaning you access it from `http://localhost:4200/admin-panel`
- It can only be accessed if the logged-in user is an admin

Here you can mainly edit technologies and languages: you can add, update and delete them. You can also delete posts, users and comments.

<details>
<summary><i>Screenshots</i></summary>

![](https://github.com/Team-Kaleidoscope/DevHive/blob/dev/screenshots/admin-panel.png)

</details>
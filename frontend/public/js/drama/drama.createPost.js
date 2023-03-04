export default function createPost(){
    
    const model = {

        init: function(){

            // Clear all the input value on web initial load.
            $("#discussHeader").val("");
            $("#discussContent").val("");

            // Froala Editor library setting.
            const editor = new FroalaEditor("#discussContent", {
                attribution: false, // remove powered by label.
                charCounterCount: false, // remove word count.
                quickInsertEnabled: false, // remove quick edit button.
                placeholderText: "請輸入討論內容",
                fontSizeSelection: true,
                height: 300,
                width: 750,
                language: "zh_tw",
                toolbarButtons: ["fontSize", "bold", "italic", "underline", "strikeThrough", "textColor", "quote", "insertHR", "align", "insertImage"]
            });

            // Handle pop up create post menu click.
            $("#discussCreatePost").click(() => {

                view.renderAddLoadingEffect();

                $(".fr-second-toolbar").remove();

                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                userAuth("/api/user/auth")
                .then(data => {
                    view.renderUserAuth(data);
                })
                .catch(error => {
                    view.renderUserAuthError(error);
                });

            });

            // Handle close menu click.
            $("#discussCloseBtn").click(() => {
                $("#discussCreatePostInput").css("display", "none");
                $("#discussLayer").css("display", "none");
                $("body").css("overflow", "auto");
            });

            // Handle create post click.
            $("#discussPostBtn").click(() => {

                view.renderAddLoadingEffect();

                // Get the image temp url link.
                const tempPhotoData = new FormData();
                const regex = /<img[^>]+src="([^">]+)"/g;
                let match;

                while(match = regex.exec(editor.html.get())){
                    tempPhotoData.append("photo", match[1]);
                };

                // Convert the photo blob to file format.
                const tempPhotoURL = tempPhotoData.get("photo");
                const discussData = new FormData();
                const discussPostID = location.href.split("/").pop();
                const discussDramaTitle = $("#dramaTitle").text().split(" (20")[0];
                const discussHeader = $("#discussHeader").val();
                const discussContent = editor.html.get();

                fetch(tempPhotoURL)
                .then((res) => res.blob())
                .then((myBlob) => {
                    const discussPhoto = new File([myBlob], "image.jpeg", {
                        type: myBlob.type
                    });

                    discussData.append("discussPostID", discussPostID);
                    discussData.append("discussDramaTitle", discussDramaTitle);
                    discussData.append("discussHeader", discussHeader);
                    discussData.append("discussContent", discussContent);
                    discussData.append("discussPhoto", discussPhoto);
                })
                .then(() => {
                    async function createPost(url, method){
                        const response = await fetch(url, method);
                        const data = await response.json();
                        return data;
                    };

                    createPost("/api/discuss", {
                        method: "POST",
                        body: discussData
                    })
                    .then(data => {
                        view.renderCreatePostData(data);
                    })
                    .catch(error => {
                        view.renderCreatePostDataError(error);
                    });
                });

            });

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderUserAuth: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                $("#discussCreatePostInput").css("display", "block");
                $("#discussLayer").css("display", "block");
                $("body").css("overflow", "hidden");

                view.renderRemoveLoadingEffect();
            };
        },

        renderUserAuthError(error){
            console.log("Error(drama.createPost.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderCreatePostData(data){
            // User input error handling.
            if(data.error && data.message == "The title does not match with the designated format"){
                alert("請輸入正確標題內容！");


                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The content does not match with the designated format"){
                alert("請輸入正確回覆內容！");

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                location.href = `/discuss/${data.data.discussPostID}?page=1`;

                view.renderRemoveLoadingEffect();
            };
        },

        renderCreatePostDataError: function(){
            console.log("Error(drama.createPost.js - 2): " + error);

            view.renderRemoveLoadingEffect();
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};
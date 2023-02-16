export default function discussPost(){

    // Clear all the input value on web initial load.
    $("#discussReply").val("");

    // Fetching discuss post data on web initial load.
    
























    // Froala Editor library setting.
    const editor = new FroalaEditor("#discussReply", {
        attribution: false, // remove powered by label.
        charCounterCount: false, // remove word count.
        quickInsertEnabled: false, // remove quick edit button.
        placeholderText: "請輸入回覆內容",
        fontSizeSelection: true,
        height: 350,
        language: "zh_tw",
        toolbarButtons: ["fontSize", "bold", "italic", "underline", "strikeThrough", "textColor", "quote", "insertHR", "align", "emoticons", "insertImage"]
    });

    // Handle discuss reply button.
    $("#discussReplyBtn").click(() => {

        // Add loading effect
        topbar.show();

        async function userAuth(url){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        userAuth("/api/user/auth")
        .then(data => {
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                // Remove loading effect
                topbar.hide();
            };

            if(data.data){
                if($("#discussReplyBtn").text() == "回覆"){
                    $("#discussReplyContainer").css("display", "block");
                    $("#discussCancelBtn").css("display", "block");
                    $("#discussReplyBtnWidth").css("flex", "none");
                    $("#discussReplyBtnWidth").css("width", "4.5%");
                    $("#discussCancelBtnWidth").css("flex", "none");
                    $("#discussCancelBtnWidth").css("width", "4.5%");
                    $("#discussReplyBtn").text("送出");

                    // Remove loading effect
                    topbar.hide();
                }
                else{
                    console.log('test')

                    // Remove loading effect
                    topbar.hide();
                };
            };
        });

    });

    // Handle cancel reply button.
    $("#discussCancelBtn").click(() => {
        $("#discussReplyContainer").css("display", "none");
        $("#discussCancelBtn").css("display", "none");
        $("#discussReplyBtnWidth").css("flex", "");
        $("#discussReplyBtnWidth").css("width", "");
        $("#discussCancelBtnWidth").css("flex", "");
        $("#discussCancelBtnWidth").css("width", "");
        $("#discussReplyBtn").text("回覆");
    });

};
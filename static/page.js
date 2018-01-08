{/* <script src="static/jquery-3.2.1/jquery-3.2.1.min.js"></script> */
}
//  detect if File API is supported
if (window.File && window.FileReader && window.FileList && window.Blob) {
    //  support
    //   alert('support');
} else {
    alert('Not support');
}

var selectPicture;
var myfile, myjson = {};
var processJson = {};
var radioValue;
var dragPicname;
var fileList = {};

function imgPreview(fileDom) {

    if (window.FileReader) {
        var reader = new FileReader();
    } else {
        alert("Your device does not support picture preview, please upgrade your device if you need this feature!");
    }

    //Get the file
    selectPicture = fileDom.files[0];


    var imageType = /^image\//;
    //Is it a picture?
    if (!imageType.test(selectPicture.type)) {
        alert("Please select a picture!");
        return;
    }
    //Read completed
    reader.onload = function (e) {
        var img = document.getElementById("preview");
        img.src = e.target.result;
    };
    reader.readAsDataURL(selectPicture);
    // $("#preview").empty();
}

$("#uploadbutton").click(function () {
    $("#uploadbutton").attr("disabled", true);
    var myFormData = new FormData();
    selectPicture = selectPicture || fileList[0]
    if (selectPicture) {
        myjson = {
            image: selectPicture
        }
    } else {
        alert("wrong!");
    }

    // console.log(myjson);
    for (var x in myjson) {
        myFormData.append(x, myjson[x]);
    }
    $.ajax({
        url: '/upload',  //server script to process data
        type: 'POST',
        success: function (data) {
            alert("Image Uploaded.");
            $("#preview").attr("src", data);
            $("#uploadbutton").removeAttr("disabled");
        },
        error: function () {
            alert("emmm, something wrong when uploading.");
            $("#uploadbutton").removeAttr("disabled");
        },
        // Form data
        data: myFormData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
});


$("#processbutton").click(function () {
    $("#processbutton").attr("disabled", true);
    $("#loading").removeClass('loading_hide');
    $.ajax({
        url: '/process?image=' + selectPicture.name + '&style=' + radioValue,  //server script to process data
        type: 'GET',
        success: function (data) {
            console.log("Processed.");
            $("#preview").attr("src", data);
            $("#processbutton").removeAttr("disabled");
            $("#loading").addClass('loading_hide');
        },
        error: function () {
            alert("emmm, something wrong in processing.");
            $("#processbutton").removeAttr("disabled");
            $("#loading").addClass('loading_hide');
        },
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
});


$(function () {
    //Block browser default line
    $(document).on({
        dragleave: function (e) {    //Drag away
            e.preventDefault();
        },
        drop: function (e) {  //drop
            e.preventDefault();
        },
        dragenter: function (e) {    //Drag into
            e.preventDefault();
        },
        dragover: function (e) {    //Drag and drop
            e.preventDefault();
        }
    });
    var box = document.getElementById('drop_area'); //drop area

    box.addEventListener("drop", function (e) {
        // window.location.reload();
        e.preventDefault(); //Cancel the default browser drag effect
        fileList = e.dataTransfer.files; //Get the file object

        if (fileList.length == 0) {
            return false;
        }
        //file is pic or not?
        if (fileList[0].type.indexOf('image') === -1) {
            alert("This is not image-type！");
            return false;
        }
        //preview func
        var img = window.URL.createObjectURL(fileList[0]);
        console.log("img is :" + img);
        console.log("fileList[0] :" + fileList[0]);
        var filename = fileList[0].name; //Name of picture

        dragPicname = filename;
        console.log(dragPicname);

        var filesize = Math.floor((fileList[0].size) / 1024);
        if (filesize > 1024) {
            alert("The size of img can't exceed 1MB.");
            return false;
        }

        $("#preview").attr("src", img);

    }, false);

    $(":radio").click(function () {
        radioValue = $("input[name='radio']:checked").val();
        console.log(radioValue);
        var preImgpath = "<img src='" + "static/21types/boat" + radioValue + ".jpg '"
            + "style=" + "'max-width:90%; display:block; padding-top:1%;'" + ">";
        console.log(preImgpath);
        $("#preImgshow").html(preImgpath);
    });
});
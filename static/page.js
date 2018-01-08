{/* <script src="static/jquery-3.2.1/jquery-3.2.1.min.js"></script> */}
//  detect if File API is supported
if (window.File && window.FileReader && window.FileList && window.Blob) {
    //  support
    //   alert('support');
    } else {
    alert('Not support');
    }
  
var selectPicname;
var myfile,myjson = {};
var processJson = {};

function imgPreview(fileDom){
  
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
  reader.onload = function(e) {

    $("#drop_preview").html("");
    //Get the picture's dom
    var img = document.getElementById("preview");
    //Picture path set to read the picture
    img.src = e.target.result;
  };
    reader.readAsDataURL(selectPicture);
    // $("#preview").empty();
}

$("#uploadbutton").click(function () {  
  var myFormData = new FormData();
  if (selectPicture == "" && fileList[0]!=""){
      myjson = {
      image:fileList[0]
      // styletype:radioValue,
      // timestamp:Date.parse(new Date())
    } 
  }else if(selectPicture != "" && fileList[0] == ""){
    myjson = {
      image:selectPicture
    }    
  }else{
    alert("wrong!");
  }  
    
  // console.log(myjson);
  for(var x in myjson){
    myFormData.append(x, myjson[x]);
  }
  $.ajax({
    url: '/upload',  //server script to process data
    type: 'POST',
    success: function () {
       alert("Data Uploaded ok.");
    },
    error: function(){
       alert("Data Upload error");
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
      myjson = {
        photoname:selectPicture.name,
        styletype:radioValue,
        timestamp:Date.parse(new Date())
      }
  
    
  // console.log(myjson);
  for(var x in myjson){
    myFormData.append(x, myjson[x]);
  }
  $.ajax({
    url: '/process',  //server script to process data
    type: 'GET',
    success: function () {
       alert("Data Uploaded ok.");
    },
    error: function(){
       alert("Data Upload error");
    },
    // Form data
    data: myFormData,
    //Options to tell JQuery not to process data or worry about content-type
    cache: false,
    contentType: false,
    processData: false
  });
});
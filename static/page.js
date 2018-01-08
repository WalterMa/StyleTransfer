{/* <script src="static/jquery-3.2.1/jquery-3.2.1.min.js"></script> */}
//  detect if File API is supported
if (window.File && window.FileReader && window.FileList && window.Blob) {
    //  support
    //   alert('support');
    } else {
    alert('Not support');
    }
  
var selectPicture;
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
  if(selectPicture){
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
    success: function (data) {
       console.log("Data Uploaded ok.");
       $("#preview").attr("src", data);
       $("#uploadbutton").removeAttr("disabled");
    },
    error: function(){
       alert("Data Upload error");
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
  $.ajax({
    url: '/process?image='+selectPicture.name+'&style='+radioValue,  //server script to process data
    type: 'GET',
    success: function (data) {
       console.log("Processed.");
       $("#preview").attr("src", data);
       $("#processbutton").removeAttr("disabled");
    },
    error: function(){
       alert("Processing error");
       $("#processbutton").removeAttr("disabled");
    },
    //Options to tell JQuery not to process data or worry about content-type
    cache: false,
    contentType: false,
    processData: false
  });
});
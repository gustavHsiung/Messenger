Ti.include('birdhouse.js');

var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//hold image data blob from the device's gallery
var selectedImage = null;

//
// create root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundImage: 'img/background.png'
});


var label1 = Titanium.UI.createLabel({
	color:'EEE',
	text: 'Photo Share: \nEmail, Facebook & Twitter',
	font:{fontSize:20,fontFamily:'Helvetica Neue',fontWeight:'bold'},
	width:300,
	top:20,
	left:20
});

win1.add(label1);

var thumbnailImage = Titanium.UI.createImageView({ 
	width: pWidth/3,
	height: 120,
	left: 20,
	top: 90, 
	backgroundColor: '#000',
	borderSize: 10,
	borderColor: '#fff'
});
win1.add(thumbnailImage);

//button to set photo as chosen one
var imageChooseButton = Titanium.UI.createButton({
	width:	pWidth/3,
	height: 40,
	top: 220,
	left: 20,
	title: 'Choose'
});

imageChooseButton.addEventListener('click',function(e){
	Titanium.Media.openPhotoGallery({
		success:function(event)
		{
			selectedImage = event.media;
			//set image view
			Titanium.API.debug('Image type was:'+event.mediaType);
			if(event.mediaType == Titanium.Media.MEDIA_TYPE_PHOTO)
			{
				thumbnailImage.image = selectedImage;
			}
		},
		cancel:function()
		{
			Titanium.API.info('Image selection was canceled');
			
		}
	});
})
win1.add(imageChooseButton);

// Message inputs
var titleTextField = Titanium.UI.createTextField({ 
	width:	pWidth/2,
	height:	40,
	left: 	20+pWidth/3+10,
	top:	90,
	font: {fontSize: 16}, 
	value: 'Title...',
	borderStyle: 2,
	backgroundColor: '#fff'
}); 
win1.add(titleTextField);

var messageTextArea = Titanium.UI.createTextArea({ 
	width:	pWidth/2,
	height: 120,
	left: 	20+pWidth/3+10,
	top: 	140,
	value: 'Message ...',
	font: {fontSize: 15}, 
	borderStyle: 2, 
	backgroundColor: '#fff'
});
win1.add(messageTextArea);

var emailButton = Titanium.UI.createButton({
	width: 280,
	height: 40,
	top: 300,
	left: 20,
	title: 'Send Via Email' 
});

emailButton.addEventListener('click', function(e){ 
	if(selectedImage != null) {
		postToEmail();
	} else {
		alert('You must select an image first!'); 
	}
}); 

win1.add(emailButton);

var twitterButton = Titanium.UI.createButton({
	width: 280,
	height: 40,
	top: 350,
	left: 20,
	title: 'Send Via Twitter' 
});

twitterButton.addEventListener('click' , function(e){
	if(selectedImage != null) {
		postToTwitter(); 
	} else {
		alert('You must select an image first!'); 
	}
});
	
win1.add(twitterButton);

var facebookButton = Titanium.UI.createButton({ 
	width: 280,
	height: 40, 
	top: 390,
	left: 20,
	title: 'Send Via Facebook' 
});
facebookButton.addEventListener('click', function(e){
	 if(selectedImage != null) {
		postToFacebook( ); 
	} else{
		alert('You must select an image first!'); }
});
win1.add( facebookButton) ;

win1.open();

//************************Function****************************//
//create email 
function postToEmail() {
	
	//get or create app data direction
	var newDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'attachments');
	if(!newDir.exists())
	{
		newDir.createDirectory();
	}
	//create temp image file from selected image
	var writeFile = Titanium.Filesystem.getFile(newDir.nativePath,'temp-image.jpg');
	writeFile.write(selectedImage);
	
	var emailDialog = Titanium.UI.createEmailDialog(); 
	emailDialog.subject = titleTextField.value;
	emailDialog.toRecipients = ['chiayuan_hsiung@infofab.com'];
	emailDialog.messageBody = messageTextArea.value;
	emailDialog.addAttachment(writeFile);
	emailDialog.open();
}
//create facebook session and post to fb 
function postToFacebook() {
//if the user is not logged in, do so, else post to wall
	if(Titanium.Facebook.loggedIn == false) {
		Titanium.Facebook.appid = '203212366445168'; 
		Titanium.Facebook.permissions = ['publish_stream'];
		Titanium.Facebook.addEventListener('login' ,function(e){
			if(e.success) {
				alert('You are now logged in! Try send again!');
			} else if(e.error) {
				alert('Error: ' + e.error);
			} else if(e.cancelled) {
				alert('You cancelled the login');
			}
		});
		//call the facebook authorize method to login
		Titanium.API.info('>>>>>>>>>>>>>>>>>>>GO FB authorize');
		Titanium.Facebook.authorize(); 
	}else {
		//post the photo after user confirmed 
		var data = {
			caption: ' I am post ing a photo to my facebook page! ' ,
			picture: selectedImage
		};
		
		Titanium.Facebook.requestWithGraphPath('me/photos' , data, "POST", function(e) {
			if (e.success) {
				alert( "Success! Your image has been posted to your Facebook wall.");
				Ti.API.info("Success! The image you posted has the new ID: " + e.result); 
			}else {
				alert('Your image could not be posted to Facebook at this time. Try again later.');
				Ti.API.error(e.error);
			} 
		});
	} //end if else loggedIn 
	
}
//create twitter session and post a tweet 
function postToTwitter()
{
	var BH = new BirdHouse({
		consumer_key: "viVYG90RprGsE9l9jxUvw",
		consumer_secret: "QLW8pshoPf3t4YnexyT9X0HZEvhsjRP0ysyluighI"
	});
	//call the birdhouse authorize() method
	BH.authorize(function(){
		if(BH.isAuthorized())
		{
			uploadPhoto(BH);
		}
	});
}
function uploadPhoto(BH)
{
		var xhr = Titanium.Network.createHTTPClient({
 
    		enableKeepAlive:false
		});
		xhr.open('POST','http://titotw.herokuapp.com/tweet');
		
		xhr.onload = function(response) {
			//the image upload method has finished 
			if(this.responseText != '0')
			{
				Ti.API.info(">>>>>>>>>>>>>>>>>>>>>> responseText:" +this.responseText);
				Ti.API.info(">>>>>>>>>>>>>>>>>>>>>> messageTextArea:" +messageTextArea.value);
				BH.tweet(messageTextArea.value +" " +this.responseText ,function(result){
	         		if(result){
						alertDialog = Ti.UI.createAlertDialog({ message:'Tweet posted!'});
						alertDialog.show();
					}else{
						
					} 
		      });
			}else{
				alert('The upload did not work! Check your server settings.' ) ;
			}	
		};
		xhr.onerror = function(e)
		{
     		Ti.API.info(e);
		};
		// send the data
		var r = randomString(5) + '.jpg';
		Ti.API.info(">>>>>>>>>>>>>>>>>>>>>> send:" +r);
		
		xhr.send({'media': selectedImage, 'randomFilename': r});

}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
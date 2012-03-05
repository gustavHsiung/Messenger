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
	color:'#999',
	text: 'Photo Share: \nEmail, Facebook & Twitter',
	font:{fontSize:16,fontFamily:'Helvetica Neue',fontWeight:'bold'},
	textAlign:'center',
	width:'auto',
	top:20,
	left:20
});

win1.add(label1);

var thumbnailImage = Titanium.UI.createImageView({ 
	width: 100,
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
	width:100,
	height: 30,
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
	width:	160,
	height:	35,
	left: 	140,
	top:	90,
	value: 'Title...',
	borderStyle: 2,
	backgroundColor: '#fff'
}); 
win1.add(titleTextField);

var messageTextArea = Titanium.UI.createTextArea({ 
	width:	160,
	height: 120,
	left:	140,
	top: 130,
	value: 'Message ...',
	font: {fontSize: 15}, borderStyle: 2, backgroundColor: '#fff'
});
win1.add(messageTextArea);

var emailButton = Titanium.UI.createButton({
	width: 280,
	height: 35,
	top: 280,
	left: 20,
	title: 'Send Via Email' });

emailButton.addEventListener('click', function(e){ 
	if(selectedImage != null) {
		postToEmail();
	} else {
		alert('You must select an image first!'); 
	}
}); 

win1.add(emailButton);

win1.open();

//************************Function****************************//
//create email 
function postToEmail() {
	var emailDialog = Titanium.UI.createEmailDialog(); 
	emailDialog.subject = titleTextField.value;
	emailDialog.toRecipients = ['info@packtpub.com'];
	emailDialog.messageBody = messageTextArea.value;
	emailDialog.open();
}
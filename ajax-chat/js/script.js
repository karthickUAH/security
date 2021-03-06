$(document).ready(function(){
	
	$('body').on('change','[name=algorithm]',function()
	{
		var algo=$('#algorithm').val();
		if(algo==1 || algo==4 || algo==5)
		{
			$('#key').show();
			
			
		}
		else
		{
			$('#key').hide();
			
			
		}
		if(algo==2 || algo==3)
		{
			$('#pubkey').show();

		}
		else
		{
			$('#pubkey').hide();

		}
		if(algo==3)
		{
			// $('#pubkey').show();
			$('#hashalg').show();
		}
		else
		{	
			$('#hashalg').hide();
			// $('#pubkey').hide();
			


		}
		if(algo==6)
		{
			$('#p').show();
			$('#q').show();
			$('#key_d').show();
			$('#key_n').show();

		}
	    else
	    {
	    	$('#p').hide();
			$('#q').hide();
			$('#key_d').hide();
			$('#key_n').hide();
			

	    }
	});
	// Run the init method on document ready:
	chat.init();

	
});

var chat = {
	
	// data holds variables for use in the class:
	
	data : {
		lastID 		: 0,
		noActivity	: 0
	},
	
	// Init binds event listeners and sets up timers:
	
	init : function(){
		
		// Using the defaultText jQuery plugin, included at the bottom:
		$('#name').defaultText('Nickname');
		$('#email').defaultText('Email (Gravatars are Enabled)');
		
		// Converting the #chatLineHolder div into a jScrollPane,
		// and saving the plugin's API in chat.data:
		
		chat.data.jspAPI = $('#chatLineHolder').jScrollPane({
			verticalDragMinHeight: 12,
			verticalDragMaxHeight: 12
		}).data('jsp');
		
		// We use the working variable to prevent
		// multiple form submissions:
		
		var working = false;
		
		// Logging a person in the chat:
		
		$('#loginForm').submit(function(){
			
			if(working) return false;
			working = true;
			
			// Using our tzPOST wrapper function
			// (defined in the bottom):
			
			$.tzPOST('login',$(this).serialize(),function(r){
				working = false;
				
				if(r.error){
					chat.displayError(r.error);
				}
				else chat.login(r.name,r.gravatar);
			});
			
			return false;
		});
		
		// Submitting a new chat entry:
		  
		$('#submitForm').submit(function(){


			// $('#keyModal').modal('show');
			var text = $('#chatText').val();
			// sendplaintext(text);
			var key = '';
			key = $('#key').val();
			console.log(key.length);
			var encrypted='';
			var algo=$('#algorithm').val();
			var SendTo=$('#SendTo').val();
			// $('#algorithm1').value=algo;
			         // document.getElementById('algorithm1').value = algo;
			
function do_status(s) {
			document.getElementById('statusTime').value = s;
}
			if(algo==0)
		   	{
		   		bootbox.alert('Please provide all details to encrypt');

		   	}
		   	else
		   	{
		   		console.log('algo:'+algo);
			switch(algo) {
			    case '1':    //AES
			        var before = new Date();
			        encrypted = CryptoJS.AES.encrypt(text, key);

			        console.log(sizeof(encrypted));
			        var after = new Date();
			        do_status("Encryption Time: " + (after - before) + "ms");
		            // document.getElementById('memory').value = "Memory Used: "+sizeof(encrypted) + " bytes";
				     console.log("KEY SIze "+sizeof(key));

			        // document.getElementById('compose-subject').value = "AES key";
			        
			        
			        break;
			    case '2':   //RSA
			        var pubkey = $('#pubkey').val();
			        var before = new Date();
			         var encrypt = new JSEncrypt();
                     encrypt.setPublicKey(pubkey);
                     encrypted = encrypt.encrypt(text);
                     var after = new Date();
			         do_status("Encryption Time: " + (after - before) + "ms");
		           // document.getElementById('memory').value = "Memory Used: "+sizeof(encrypt) + " bytes";

			         
			        break;
			    case '3':   //Digital
			        var before = new Date()
			        encrypted=doSign();
			        var after = new Date();
			        do_status("Encryption Time: " + (after - before) + "ms");
		            // document.getElementById('memory').value = "Memory Used: "+sizeof(encrypt) + " bytes";

			        break;
			    case '4':  //Hash
			        var before = new Date()

			        var hash = CryptoJS.HmacSHA256(text, key);
  					 encrypted = CryptoJS.enc.Base64.stringify(hash);
			        var after = new Date();
			        do_status("Encryption Time: " + (after - before) + "ms");
		           // document.getElementById('memory').value = "Memory Used: "+sizeof(hash) + " bytes";
				     console.log("KEY SIze "+sizeof(key));

			        break;
			 	case '5':
			        var before = new Date()

			 	      encrypted=AESEncryptCtr(text, key,256);
			 	      var after = new Date();
			          do_status("Encryption Time: " + (after - before) + "ms");
		              // document.getElementById('memory').value = "Memory Used: "+sizeof(encrypted) + " bytes";
				     console.log("KEY SIze "+sizeof(key));

			 		break;
			 	case '6':
			           var before = new Date()

			 	       encrypted=RSAEncrypt();
			 	       var after = new Date();
			           do_status("Encryption Time: " + (after - before) + "ms");
		               // document.getElementById('memory').value = "Memory Used: "+sizeof(encrypted) + " bytes";

			 	break
			    default:
			        console.log(false);
			}

			document.getElementById('ciphertext').value = encrypted;
			console.log("encrypted"+encrypted);

			if(text.length == 0){
				return false;
			}
			
			if(working) return false;
			working = true;
			
			// Assigning a temporary ID to the chat:
			var tempID = 't'+Math.round(Math.random()*1000000),
				params = {
					id			: tempID,
					author		: chat.data.name,
					gravatar	: chat.data.gravatar,
					text		: text.replace(/</g,'&lt;').replace(/>/g,'&gt;'),
					sendto      : SendTo,
					ciphertext  : encrypted.toString()
				};

			// Using our addChatLine method to add the chat
			// to the screen immediately, without waiting for
			// the AJAX request to complete:
			
			chat.addChatLine($.extend({},params));
			
			// Using our tzPOST wrapper method to send the chat
			// via a POST AJAX request:$data+"&validate_field="+validate_field
			
			$.tzPOST('submitChat',$(this).serialize()+"&ciphertext="+encrypted.toString()+"&sendto="+SendTo,function(r){
				
				working = false;
				
				$('#chatText').val('');
				$('div.chat-'+tempID).remove();
				
				params['id'] = r.insertID;
				chat.addChatLine($.extend({},params));
			});
			}
			return false;
		});
		
		// Logging the user out:
		
		$('body').on('click','a.logoutButton',function(){
				console.log('removed');
			
			$('#chatTopBar > span').fadeOut(function(){
				console.log('removed');
				
				$(this).remove();
			});
			
			$('#submitForm').fadeOut(function(){
				$('#loginForm').fadeIn();
			});
			
			$.tzPOST('logout');
			
			return false;
		});
		
		// Checking whether the user is already logged (browser refresh)
		
		$.tzGET('checkLogged',function(r){
			if(r.logged){
				chat.login(r.loggedAs.name,r.loggedAs.gravatar);
			}
		});
		
		// Self executing timeout functions
		
		(function getChatsTimeoutFunction(){
			chat.getChats(getChatsTimeoutFunction);
		})();
		
		(function getUsersTimeoutFunction(){
			chat.getUsers(getUsersTimeoutFunction);
		})();
		
	},
	
	// The login method hides displays the
	// user's login data and shows the submit form
	
	login : function(name,gravatar){
		
		chat.data.name = name;
		chat.data.gravatar = gravatar;
		$('#chatTopBar').html(chat.render('loginTopBar',chat.data));
		
		$('#loginForm').fadeOut(function(){
			$('#submitForm').fadeIn();
			$('#chatText').focus();
		});
		
	},
	
	// The render method generates the HTML markup 
	// that is needed by the other methods:
	
	render : function(template,params,Plaintext){
		var algo=$('#algorithm').val();
		
		var arr = [];
		switch(template){
			case 'loginTopBar':
				arr = [
				'<span><img src="',params.gravatar,'" width="23" height="23" />',
				'<span class="name">',params.name,
				'</span><a href="" class="logoutButton rounded">Logout</a></span>'];
			break;
			
			case 'chatLine':
			// <span class="text">',params.text
				arr = [
					'<div class="chat chat-',params.id,' rounded"><span class="gravatar"><img src="',params.gravatar,
					'" width="23" height="23" onload="this.style.visibility=\'visible\'" />','</span><span class="author">',params.author,
					':</span><br/><span class"sendTo"><strong>To:</strong>',params.sendto,'</span><br/><span class="ciphertext" style="word-break:break-all;"><strong>CipherText:</strong>',(algo==1 || algo==2)?params.ciphertext.replace(/ /g,'+'):params.ciphertext,'<br/></span><span class="time">',params.time,'</span></div>'];
			break;
			case 'chatLine2':
				arr = [
					'<div class="chat chat-',params.id,' rounded"><span class="gravatar"><img src="',params.gravatar,
					'" width="23" height="23" onload="this.style.visibility=\'visible\'" />','</span><span class="author">',params.author,
					':</span><br/><span class"sendTo"><strong>To:</strong>',params.sendto,'</span><br/><span class="ciphertext" style="word-break:break-all;">',params.ciphertext,'</span></span><span class="time">',params.time,'</span></div>'];
			break;
			case 'user':
				arr = [
					'<div class="user" title="',params.name +','+params.email,'"><span class="gravatar"><img src="',
					params.gravatar,'" width="30" height="30" onload="this.style.visibility=\'visible\'" /></div>'
				];
			break;
		}
		
		// A single array join is faster than
		// multiple concatenations
		
		return arr.join('');
		
	},
	
	// The addChatLine method ads a chat entry to the page
	
	addChatLine : function(params,ajax_response,Plaintext){
		
		// All times are displayed in the user's timezone
		
		var d = new Date();
		if(params.time) {
			
			// PHP returns the time in UTC (GMT). We use it to feed the date
			// object and later output it in the user's timezone. JavaScript
			// internally converts it for us.
			
			d.setUTCHours(params.time.hours,params.time.minutes);
		}
		
		params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+
					  (d.getMinutes() < 10 ? '0':'') + d.getMinutes();
		// console.log(params);
		var markup = ajax_response==2?chat.render('chatLine',params,Plaintext):chat.render('chatLine2',params),
		// var markup =chat.render('chatLine2',params);

		// var markup1 =chat.render('chatLine',params);

			exists = $('#chatLineHolder .chat-'+params.id);

		if(exists.length){
			exists.remove();
		}
		
		if(!chat.data.lastID){
			// If this is the first chat, remove the
			// paragraph saying there aren't any:
			
			$('#chatLineHolder p').remove();
		}
		
		// If this isn't a temporary chat:
		// console.log(params.id.toString().charAt(0));
		if(params.id.toString().charAt(0) != 't'){
			var previous = $('#chatLineHolder .chat-'+(+params.id - 1));
			if(previous.length){
				previous.after(markup);
			}
			else chat.data.jspAPI.getContentPane().append(markup);
		}
		else chat.data.jspAPI.getContentPane().append(markup);
		
		// As we added new content, we need to
		// reinitialise the jScrollPane plugin:
		
		chat.data.jspAPI.reinitialise();
		chat.data.jspAPI.scrollToBottom(true);
		
	},
	
	// This method requests the latest chats
	// (since lastID), and adds them to the page.
	
	getChats : function(callback){
			

		$.tzGET('getChats',{lastID: chat.data.lastID},function(r){
			ajax_response=2;
			for(var i=0;i<r.chats.length;i++){
				chat.addChatLine(r.chats[i],ajax_response);
			}
			
			if(r.chats.length){
				chat.data.noActivity = 0;
				chat.data.lastID = r.chats[i-1].id;
			}
			else{
				// If no chats were received, increment
				// the noActivity counter.
				
				chat.data.noActivity++;
			
	
			}
			if(!chat.data.lastID){
				chat.data.jspAPI.getContentPane().html('<p class="noChats">No chats yet</p>');
			}
			
			// Setting a timeout for the next request,
			// depending on the chat activity:
			
			var nextRequest = 1000;
			
			// 2 seconds
			if(chat.data.noActivity > 3){
				nextRequest = 2000;
			}
			
			if(chat.data.noActivity > 10){
				nextRequest = 5000;
			}
			
			// 15 seconds
			if(chat.data.noActivity > 20){
				nextRequest = 15000;
			}
		
			setTimeout(callback,nextRequest);
		});
	},
	
	// Requesting a list with all the users.
	
	getUsers : function(callback){
		$.tzGET('getUsers',function(r){
			
			var users = [];
			var selection;
			for(var i=0; i< r.users.length;i++){
				if(r.users[i]){
					users.push(chat.render('user',r.users[i]));
			       selection=$('#compose-to').append('<option>' + r.users[i].email + '</option>');
			       console.log(r.users[i].email);
				}
	       

			}
			var message = '';
			
			if(r.total<1){
				message = 'No one is online';
			}
			else {
				message = '\n'+r.total+' '+(r.total == 1 ? 'person':'people')+' online';
			}
			
			users.push('<p class="count">'+message+'</p>');
			
			$('#chatUsers').html(users.join(''));
			
			setTimeout(callback,15000);
		});
	},
	
	// This method displays an error message on the top of the page:
	
	displayError : function(msg){
		var elem = $('<div>',{
			id		: 'chatErrorMessage',
			html	: msg
		});
		
		elem.click(function(){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		
		setTimeout(function(){
			elem.click();
		},5000);
		
		elem.hide().appendTo('body').slideDown();
	}
};

// Custom GET & POST wrappers:

$.tzPOST = function(action,data,callback){
	$.post('php/ajax.php?action='+action,data,callback,'json');
}

$.tzGET = function(action,data,callback){
	$.get('php/ajax.php?action='+action,data,callback,'json');
}

// A custom jQuery method for placeholder text:

$.fn.defaultText = function(value){
	
	var element = this.eq(0);
	element.data('defaultText',value);
	
	element.focus(function(){
		if(element.val() == value){
			element.val('').removeClass('defaultText');
		}
	}).blur(function(){
		if(element.val() == '' || element.val() == value){
			element.addClass('defaultText').val(value);
		}
	});
	
	return element.blur();
}
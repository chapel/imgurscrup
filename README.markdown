ImgurScrup
==========

Allows you to upload images to Imgur.com directly from [Scrup](https://github.com/rsms/scrup).

Installation
------------

With [npm](https://github.com/isaacs/npm):

	npm install imgurscrup
	
Clone this project:

	git clone https://github.com/chapel/ngist.git
	

Usage
-----

It is as simple as installing then loading it up with:

	imgurscrup <port>
	
It will run as a server and you should configure Scrup to
send images to a specific url which as follows:

	http://localhost:<port>/key=<key>
	
You want to replace port with whatever you want or it will 
default to 8000. You will of course need to add your Imgur.com
anonymous key in place of <key> to use this.

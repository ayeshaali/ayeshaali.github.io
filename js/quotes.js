var faveQuotes = [
    '"Put your heart, mind, and soul into even your smallest acts. This is the secret of success."<br> -Swami Sivananda',
    '"Strength is a matter of the made-up mind."<br> -John Beecher',
    '"Anything is possible if you\'ve got enough nerve."<br> -JK Rowling',
    '“Think lightly of yourself and deeply of the world.”<br> -Miyamoto Musashi',
    '"We gain strength, and courage, and confidence by each experience in which we really stop to look fear in the face."<br> -Eleanor Roosevelt',
    '"In a gentle way, you can shake the world."<br> -Mahatma Ghandi',
    '“It always seems impossible until it’s done.”<br> —Nelson Mandela'
];

var randomNumber = Math.floor(Math.random()*faveQuotes.length);

document.addEventListener('DOMContentLoaded', function(){
    Typed.new("#line-1", {
        strings: [faveQuotes[randomNumber]],
        typeSpeed: 50,
        backDelay: 500,
        loop: false,
        contentType: 'html', 
        loopCount: null,
    });
});
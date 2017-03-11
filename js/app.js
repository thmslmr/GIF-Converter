const   gifshot = require('gifshot'),
        remote = require('electron').remote;

window.ondragover = window.ondrop  = function(e){e.preventDefault();};

new Vue({
    el : '#app',
    data : {
        isDragging : false,
        currentDl : null,
        myfiles : []
    },
    methods : {

        dropFiles : function(e){
            this.isDragging = false;
            var files  = e.dataTransfer.files;
            for(var i = 0; i < files.length; i++){

                var file = {
                    id : this.myfiles.length + 1,
                    name : files[i].name,
                    src : URL.createObjectURL(files[i]),
                    state : 'waitting',
                    gif : ''
                };

                this.myfiles.push(file);
            }
        },

        deleteFile : function(file){
            this.myfiles.splice(this.myfiles.indexOf(file), 1);
        },

        gify : function(){
            var self = this;

            var files = this.myfiles.filter(function(file){
                return file.state !='completed';
            });

            var file = files[0];
            file.state = "running";

            gifshot.createGIF({
                'video' : [file.src]
            }, function(obj){
                if(!obj.error) {

                    file.gif = obj.image;
                    file.state = 'completed';
                    file.name = file.name.split('.')[0]+'.gif';
                    if(files.length > 1)
                    self.gify();
                }
            });

        },

        closeWindow : function(){
            var window = remote.getCurrentWindow();
            window.close();
        }
    }
});

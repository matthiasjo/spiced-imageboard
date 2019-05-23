(function() {
    var vm = new Vue({
        // majority of our Vue code will go into this object
        el: "#main",
        //data is our best fried <3
        data: {
            name: "matthias",
            images: [],
            formUpload: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            cuteAnimals: [
                {
                    name: "Rabbit",
                    cuteness: 6
                },
                {
                    name: "Fox",
                    cuteness: 9
                },
                {
                    name: "Blobfish",
                    cuteness: 1
                }
            ]
        },
        mounted: function() {
            // here we are going to make axios requests to get data
            //from the server that we need to then render on screen

            var self = this;
            //this refers to the vue instane
            axios.get("/data").then(function(resp) {
                // NO ARROW FUNCTIONS!!!
                self.images = resp.data.rows;
                // console.log("GET /cities", resp.data);
                console.log("self", self.images);
                // with this line of code ,the cities array now lives in the data
                // object in view
            });
        },
        methods: {
            // every single function that runs in response to an event will be written here.
            handleFiles: function(event) {
                this.formUpload.file = event.target.files[0];
            },
            uploadFile: function() {
                var formData = new FormData();
                formData.append("file", this.formUpload.file);
                formData.append("title", this.formUpload.title);
                formData.append("username", this.formUpload.username);
                formData.append("description", this.formUpload.description);

                axios.post("/upload", formData).then(function(resp) {
                    vm.images.unshift(resp.data);
                });
            }
        }
    });
})();

(function() {
    Vue.component("modal-component", {
        props: ["clickedImgCard"],
        data: function() {
            // with function obj is shared. with func its for the comp unique
            // applies only if component is rendered multiple times
            return {
                modalInfo: [],
                modalComments: [],
                sendComment: {
                    comment: "",
                    username: "",
                    id: this.clickedImgCard
                }
            };
        },
        mounted: function() {
            console.log("clicked Img Url: ", this.clickedImgCard);
            var self = this;
            axios
                .get("/get-img-info/" + this.clickedImgCard)
                .then(resp => {
                    self.modalInfo = resp.data[0];
                    self.modalComments = resp.data[1].reverse();
                })
                .catch(err => console.log(err));
        },
        methods: {
            uploadComment: function() {
                var formData = new FormData();
                formData.append("comment", this.sendComment.comment);
                formData.append("username", this.sendComment.username);

                var self = this;
                axios
                    .post("/sendComment", this.sendComment)
                    .then(function(resp) {
                        self.modalComments.unshift(resp.data);
                    });
            },
            closeModal: function() {
                this.$emit("close-modal");
            }
        },
        template: "#modal-template"
    });

    var vm = new Vue({
        // majority of our Vue code will go into this object
        el: "#main",
        data: {
            clickedImgCard: "",
            images: [],
            formUpload: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            // here we are going to make axios requests to get data
            //from the server that we need to then render on screen

            var self = this;
            //this refers to the vue instane
            axios.get("/data").then(function(resp) {
                // NO ARROW FUNCTIONS!!!
                self.images = resp.data.rows.reverse();
            });
        },
        methods: {
            toggleModal: function(imageId) {
                this.clickedImgCard = imageId;
            },
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

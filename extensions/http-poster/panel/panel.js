'use strict';
const fs = require('fs');
const path = require('path');
const axios = require('axios');


// html text
exports.template = fs.readFileSync(path.join(__dirname, 'panel.html'), 'utf8');
// style text
exports.style = '';//fs.readFileSync(path.join(__dirname, 'css.css'), 'utf8');
// html selector after rendering
exports.$ = {
	app: '#app'
};

// method on the panel
exports.methods = {};
// event triggered on the panel
exports.listeners = {};

let change = '';

// Triggered when the panel is rendered successfully
exports.ready = async function () {
	let Vue = require('./vue');
	new Vue({
        el: this.$.app, // 注意这里，没有不能使用#app，原因是ShadowDOM
        data () {
            return {
				address:'',
				picPath:'http://106.14.239.27/img/0.png',
				retJson:'',
				body:'',
                header:JSON.stringify({'Content-Type': 'application/json'}),
				action:'GET'
			}
        },
        created () {
            console.log(this.picPath);
        },
        methods: {
            onBtnClick () {
				let self = this;
				if (this.action == 'GET'){
					axios.get(this.address,{
                        params:self.body,
                        headers:JSON.parse(self.header)})
					.then(res => {
                        self.retJson = JSON.stringify(res.data);
					})
					.catch(error => {
						console.log(error);
					});
				}else{
                    axios.post(this.address,this.body,
                        {
                            headers:JSON.parse(self.header)
                        })
                        .then(res=>{
                            self.retJson = JSON.stringify(res.data);

                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                console.log('点击按钮'+this.action)

            }
        }
    });
};
// Triggered when trying to close the panel
exports.beforeClose = async function () {

 };
// Triggered when the panel is actually closed
exports.close = async function () { };

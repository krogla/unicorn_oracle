<template>
    <ul>
        <li v-for="event in eventCreate">
            {{event}}
        </li>

        <li v-for="event in eventHybr">
            {{event}}
        </li>

        <li v-for="event in eventTransfer">
            {{event}}
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                eventCreate: [],
                eventHybr: [],
                eventTransfer: [],
                socket: null
            }
        },
        computed: {},
        created() {
            Echo.channel('unicorn')
                .listen('.unicorn.creation', function (e) {
                    // console.log('unicorn.creation')
                    if (this.eventCreate.push(e) > 20) {
                        this.eventCreate.shift();
                    }
                }.bind(this))
                .listen('.unicorn.hybridisation', function (e) {
                    // console.log('unicorn.hybridisation')
                    if (this.eventHybr.push(e) > 20) {
                        this.eventHybr.shift();
                    }
                }.bind(this))
                .listen('.unicorn.transfer', function (e) {
                    // console.log('unicorn.transfer')
                    if (this.eventTransfer.push(e) > 20) {
                        this.eventTransfer.shift();
                    }
                }.bind(this))
        },
        mounted() {
            console.log('Component mounted.')

            this.socket = io("http://52.214.37.156:8080", {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            "x-auth": "1234",
                            "x-user-id": 345,
                            "x-blockchain-id": "0x123123"
                        }
                    }
                },
                query: {
                    "x-auth": "1234",
                    "x-user-id": 345,
                    "x-blockchain-id": "0x123123"
                }
            })
            this.socket.on("auth_success", console.log)

        },
        methods: {}
    }
</script>



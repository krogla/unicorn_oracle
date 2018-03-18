<template>
    <ul>
        <li v-for="event in eventlist">
            {{event}}
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                eventlist: [],
            }
        },
        computed: {},
        created() {
            Echo.channel('unicorn2')
                .listen('UnicornCreation2', function (e) {
                    if (this.eventlist.push(e) > 20) {
                        this.eventlist.shift();
                    }
                }.bind(this))
            // .listen('UnicornHybridisation', function (e) {
            //     if (this.eventlist.push(e) > 20) {
            //         this.eventlist.shift();
            //     }
            // }.bind(this))
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods: {}
    }
</script>



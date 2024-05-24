<script>
    import { onMount } from 'svelte';
    
    let userLogged = false

    let tweets = []

    const checkUser = async () => {
        fetch('http://localhost:8080/api/check-session', 
        {headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    userLogged = true
                }
            })
    }

    const seeTweets = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/read-tweets', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error("A problem occurred while fetching tweets");
        }

        tweets = await response.json();

    } catch (error) {

        console.error('Error fetching tweets:', error);
        alert("A problem occurred while fetching tweets");
    }
}

    onMount(checkUser)
    onMount(seeTweets)

    const sendTweet = async () => {

        let tweetText = prompt("Write Your Tweet")

        if (tweetText == "") {
            alert("Pleaase fill in the text field")
        }

        else {
            fetch('http://localhost:8080/api/write-tweets', 
        {method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: tweetText
            })})
            .then(response => {
            if (response.ok) {
                return response.body; 
            } else {
                throw new Error('Failed to fetch tweets');
            }
            })
            .then(data => {
                tweets = data;
            })
            .catch(error => {
                console.error('Error fetching tweets:', error);
            });
            }

            console.log(tweets) 
    }

    const logout = async() => {
        fetch('http://localhost:8080/api/logout', 
        {headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/login"
                }
            })
    }
    
    const manageLikes = () => {
        
    }

</script>

<main>
    {#if userLogged}
        <div class="logout-container-div" id="logout-container-div">
            <button on:click={logout} id="logout">Log Out</button>
        </div>
        <div class="tweet-send-container-div" id="tweet-send-container-div">
            <button on:click={sendTweet} id="send-tweet">Send Tweets</button>
        </div>
        <div class="tweet-container-div" id="tweet-container-div">
            {#each tweets as tweet, id}
                <div class="tweet-container">
                    <h3>{tweet.user}:</h3>
                    <h3>{tweet.text}</h3>
                    <h3><b>likes:</b>{tweet.like}</h3>
                    <h6>like</h6>
                    <input type="checkbox" id="checkbox" on:change={manageLikes}/>
                </div>
            {/each} 
        </div>
    {:else}
        Log in First
    {/if}
</main>

<style>
    .tweet-container {
        display: flex;
        flex-direction: row;
        gap: 30px;
    }

    .tweet-container-div {
        display: flex;
        flex-direction: column;

    }

    :global(body) {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
</style>


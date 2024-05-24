<script>
    let email;
    let password;

    const signUp = async() => {
        fetch('http://localhost:8080/api/sign-up', 
        {method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })})
            .then(response => {
                if (response.ok) {
                    console.log("The user is successfully added")
                    window.location.href = "/home"
                }
                else {
                    console.log(response.text)
                }
            }
        )
    }
</script>

<main>
    <div class="root">
        <div class="sign-up-info-div-container">
            <div class="sign-up-info">
                <h4>Sign-up</h4>
                <div class="email-input-div-container">
                    <h4>E-mail:</h4>
                    <input
                            class="email-input"
                            id="email-input"
                            value=email
                            on:change={(e) => email = e.target.value}
                    />
                </div>
                <div class="pass-input-div-container">
                    <h4>Password:</h4>
                    <input
                            class="pass-input"
                            id="pass-input"
                            type="password"
                            value={password}
                            on:change={(e) => password = e.target.value}
                    />
                </div>
                <h4> </h4>
                <button type="button" class="sign-up-button" on:click={signUp}>Submit</button>
            </div>
        </div>
    </div>
</main>

<style>
    :global(body) {
        background-color: #2e3b41;
        color: white;
        font-family: sans-serif;
    }

    button {
        border-radius: 5px;
        border: none;
    }

    button:hover {
        opacity: 80%;
    }

    button:active {
        opacity: 60%;
    }

    .sign-up-info-div-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

    .sign-up-info {
        display: flex;
        flex-direction: column;
    }
</style>


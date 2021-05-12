import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Singin';
import Register from './components/Register/Register'
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import axios from 'axios';

const particlesOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            },
            polygon: {
                enable: true
            }
        }
    }
}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
    }
}
class App extends Component {
    state = initialState;

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage')
        const width = Number(image.width);
        const height = Number(image.height)
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
            }
        })
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value })
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route })
    }

    onSubmit = () => {
        this.setState({ imageUrl: this.state.input });
            axios.post('http://localhost:5002/imageurl', {input:this.state.input})
            .then(response => {
                console.log(response)
                return response.data
            })
            .then(response => {
                if (response) {
                    axios.put('http://localhost:5002/image', {id: this.state.user.id})
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .then(response => {
                this.setState(Object.assign(this.state.user, {entries: response}))
            })
            .catch(err => console.log(err))
    }
    // onSubmit = () => {
    //     this.setState({ imageUrl: this.state.input });
    //     fetch('http://localhost:5002/imageurl', {
    //         method: 'post',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             input: this.state.input
    //         })
    //     })
    //         .then(response => response.json())
    //         .then(response => {
    //             if (response) {
    //                 fetch('http://localhost:5002/image', {
    //                     method: 'put',
    //                     headers: { 'Content-Type': 'application/json' },
    //                     body: JSON.stringify({
    //                         id: this.state.user.id
    //                     })
    //                 })
    //                     .then(response => response.json())
    //                     .then(count => {
    //                         this.setState(Object.assign(this.state.user, { entries: count }))
    //                     })
    //                     .catch(console.log)

    //             }
    //             this.displayFaceBox(this.calculateFaceLocation(response))
    //         })
    //         .catch(err => console.log(err));
    // }

    render() {
        return (
            <div className="App">
                <Particles
                    className='particles'
                    params={particlesOptions}
                />
                <Navigation
                    isSignedIn={this.state.isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                { this.state.route === 'home' ?
                    <div>
                        <Logo />
                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onSubmit={this.onSubmit}
                        />
                        <FaceRecognition
                            imageUrl={this.state.imageUrl}
                            box={this.state.box}

                        />
                    </div>
                    : (
                        this.state.route === 'signin' ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            : <Register
                                onRouteChange={this.onRouteChange}
                                loadUser={this.loadUser}
                            />
                    )
                }
            </div>
        );
    }
}


export default App;

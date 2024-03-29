import React, { Component } from 'react'
import SideNavBarProperty from './SideNavBarProperty';
import { PropTypes } from 'react'

export default class PropertyDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headline: "",
            description: "",
            bedroom: "",
            bathroom: "",
            accomodates: "",
            amenities: "",
            propertyType: ""
        }
        this.handleStateChange = this.handleStateChange.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);

    }
    handleStateChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    saveAndContinue(e) {
        e.preventDefault()
        var data = {
            headline: this.state.headline,
            description: this.state.description,
            bedroom: this.state.bedroom,
            bathroom: this.state.bathroom,
            accomodates: this.state.accomodates,
            amenities: this.state.amenities,
            propertyType: this.state.propertyType
        }

        console.log("data is " + JSON.stringify(data));
        console.log("field value" + this.props.fieldValues)
        this.props.saveFields(data);
        this.props.nextStep();

    }





    render() {
        return (
            <div>
                <div className="container" style={{ backgroundColor: "#eee" }}>
                    <div class="main-div form-group">
                        <form>
                            <div>
                                <h1 style={{ fontSize: "20px", textAlign: "left" }}>Describe your property</h1>
                            </div>
                            <div className="row">
                                <span>Start out with a descriptive headline and a detailed summary of your property.</span>
                            </div>
                            <div className="row">
                                <input type="text" class="form-control" name="headline"
                                    placeholder="Headline" onChange={this.handleStateChange} required="true" />
                                <div id="accomodates-error" class="error"></div>
                            </div>

                            <div className="row">
                                <textarea class="form-control" rows="5" name="description"
                                    placeholder="Property Description" onChange={this.handleStateChange} ></textarea>
                            </div>

                            <div className="row">
                                <select required className="form-control" name="propertyType" onChange={this.handleStateChange} >
                                    <option value="" disabled selected hidden>Property Type</option>

                                    <option value="house">Apartments</option>
                                    <option value="villa">Villa</option>
                                    <option value="studio">Studio</option>

                                </select>
                            </div>
                            <div className="row">
                                <select required className="form-control" name="bedroom" onChange={this.handleStateChange} >
                                    <option value="" disabled selected hidden>Bedrooms</option>

                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                </select>
                            </div>
                            <div className="row">
                                <input onChange={this.handleStateChange} type="number" class="form-control" name="accomodates"
                                    placeholder="Accomodates" required="true" />
                            </div>
                            <div id="accomodates-error" class="error"></div>
                            <div className="row">
                                <select required className="form-control" name="bathroom" onChange={this.handleStateChange} >
                                    <option value="" disabled selected hidden>Bathrooms</option>
                                    <option value="1">1</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2">2</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3">3</option>
                                    <option value="3.5">3.5</option>
                                    <option value="4">4</option>
                                    <option value="4.5">4.5</option>
                                    <option value="5">5</option>
                                    <option value="5.5">5.5</option>
                                    <option value="6">6</option>
                                    <option value="6.5">6.5</option>
                                    <option value="7">7</option>
                                    <option value="7.5">7.5</option>
                                    <option value="8">8</option>
                                    <option value="8.5">8.5</option>
                                    <option value="9">9</option>
                                    <option value="9.5">9.5</option>
                                </select>
                            </div>


                            <div className="row">
                                <textarea onChange={this.handleStateChange} class="form-control" rows="5" name="amenities" placeholder="List your Amenities"></textarea>
                            </div>

                            <div id="amenities-error" class="error"></div>
                            <p></p>
                            <div>
                                <button className="btn-primary form-group" onClick={this.saveAndContinue}>Next</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

import React, { Component } from 'react'
import Location from './Location';
import PropertyDetails from './PropertyDetails';
import Pricing from './Pricing';
import Confirmation from './Confirmation';
import axios from 'axios';
import cookie from 'react-cookies';
import SideNavBarProperty from './SideNavBarProperty';
import { connect } from 'react-redux';
import HeaderOwner from './HeaderOwner';
import swal from 'sweetalert2'

class ListYourProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValues: {
                address: "",
                headline: "",
                description: "",
                bedroom: "",
                bathroom: "",
                accomodates: "",
                amenities: "",
                availableFrom: "",
                availableTo: "",
                propertyType: "",
                bookingType: "",
                currency: "",
                baseRate: "",
                selectedFiles: [],

            },
           
            imagenames: [],
            step: 1,
            //owner : ""
        };
        this.nextStep = this.nextStep.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.saveFields = this.saveFields.bind(this);
        this.submitProperty = this.submitProperty.bind(this);
       // this.saveImage = this.saveImage.bind(this);

    }
    renderForm() {
     
            console.log("next step is " + this.state.step);
            switch (this.state.step) {
                case 1:
                    return (
                        <div>
                            <Location saveFields={this.saveFields}
                                nextStep={this.nextStep}
                                fieldValues={this.state.fieldValues}
                                saveImage={this.state.saveImage}
                            />
                        </div>
                    )
                case 2:
                    return (<div><PropertyDetails saveFields={this.saveFields}
                        nextStep={this.nextStep}

                        fieldValues={this.state.fieldValues}
                    /></div>)

                case 3:
                    return (<div><Pricing saveFields={this.saveFields}
                        nextStep={this.nextStep}

                        fieldValues={this.state.fieldValues} /></div>)
                case 4:
                    return (<div><Confirmation submitProperty={this.submitProperty}

                        fieldValues={this.state.fieldValues} /></div>)
            }
        

    }

    saveFields(fields) {
        var copydata = Object.assign({}, this.state.fieldValues, fields)
        //console.log("copying objects " + JSON.stringify(copydata));
        this.setState({
            fieldValues: copydata
        });
    }
    nextStep() {
        this.setState({
            step: this.state.step + 1
        });
    }


    render(props) {
        return (
            <div>
                <HeaderOwner />
                {this.renderForm()}
            </div>
        )
    }


    submitProperty(e) {
        e.preventDefault();
        
        var self = this;
        var id=null;
        let details= this.props.userinfo.map(user=> {
            if(user!=null){
            console.log("inside map email",user.email)
            id = user.email
            }
        })
        console.log("data is ",this.state.fieldValues)
        const filenames=[];
        for(var i=0;i<this.state.fieldValues.selectedFiles.length;i++)
        {
            filenames[i]=this.state.fieldValues.selectedFiles[i].name;
        }
        console.log("names of images..", filenames)
        //console.log("names of images..1st image", this.state.fieldValues.selectedFiles[0].name)
        const data = {
            address: this.state.fieldValues.address,
            headline: this.state.fieldValues.headline,
            description: this.state.fieldValues.description,
            bedroom: this.state.fieldValues.bedroom,
            bathroom: this.state.fieldValues.bathroom,
            accomodates: this.state.fieldValues.accomodates,
            amenities: this.state.fieldValues.amenities,
            availableFrom: this.state.fieldValues.availableFrom,
            availableTo: this.state.fieldValues.availableTo,
            propertyType: this.state.fieldValues.propertyType,
            currency: this.state.fieldValues.currency,
            baseRate: this.state.fieldValues.baseRate,
            owner: id,
            images:filenames
        }
        this.props.onSubmitHandle(data)
    }
}


const mapStateToProps = state =>{
    console.log("State", state)
    console.log("State user", state.authFlag)
    return {
        authFlag : state.authFlag,
        userinfo :state.user
    }
}

const mapDispatchStateToProps = dispatch => {
    return {
        onSubmitHandle : (data) => {
console.log("inside on submit handler...")
            axios.post('http://localhost:3001/submitProperty', data)
                .then((response) => {
                    console.log("response got from Kafkaa list property... ",response)
                    if (response.data.updatedList.status === 201) {
                    console.log("Incorrect Credentials")
                    swal('Your Property listed successfully.', "Property Listed!", 'success');
                         }
                        console.log("response fetched..", response.data.resData)
                        dispatch({type: 'ADD_PROPERTY',payload :response.data.updatedList, statusCode : response.status})
                      
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchStateToProps)(ListYourProperty);
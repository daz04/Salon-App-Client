// import React from 'react';

export default class Service {

    constructor(id, stylistid, servicename, gender, servicecategory, duration, price, basetravelfee, basetravelmiles, additionalmilefee, serviceutilities, servicedescription){
        this.id = id 
        this.StylistId = stylistid
        this.ServiceName = servicename
        this.Gender = gender
        this.ServiceCategory = servicecategory
        this.Duration = duration
        this.Price = price 
        this.BaseTravelFee = basetravelfee
        this.BaseTravelMiles = basetravelmiles
        this.AdditionalMileFee = additionalmilefee
        this.ServiceUtilities = serviceutilities
        this.ServiceDescription = servicedescription

    }
}
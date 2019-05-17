/* eslint-disable no-console */
/* eslint-disable vars-on-top */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import findOpportunities from '@salesforce/apex/FindOpp.searchOpps';
import { updateRecord } from 'lightning/uiRecordApi';

// import { refreshApex } from '@salesforce/apex';
// import saveOpps from '@salesforce/apex/SaveOpps.saveUpdatedOpps';
// import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
// import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
// import PROB_FIELD from '@salesforce/schema/Opportunity.Probability';
// import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
// import ID_FIELD from '@salesforce/schema/Opportunity.Id';

const columns = [
    { label: 'Opportunity Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Amount', fieldName: 'Amount', type: 'number', editable: true },
    { label: 'Probability', fieldName: 'Probability', type: 'number', editable: true },
    { label: 'Stage', fieldName: 'StageName', type: 'Picklist', editable: true },
];

export default class DatatableWithInlineEdit extends LightningElement {
    @track columns = columns;
    @track rowOffset = 0;
    @track opportunities;
    @track error;
    @track searchKey;
    @wire(CurrentPageReference)
    pageRef;
    stringOpp;
    @track draftValues = [];

    @wire(findOpportunities, { searchOppByAcc: '$searchKey' })
    wiredOppRetrieval({ error, data }) {
        if (data) {
            // eslint-disable-next-line no-console
            console.log("inside is data");
            this.opportunities = data;
            this.error = undefined;
            if (this.isEmpty(this.opportunities)) {
                console.log("inside is empty");
                this.handleError();
                this.searchKey = " ";
            }
        } else if (error) {
            this.error = error;
            this.opportunities = undefined;
        }
    }
    connectedCallback() {
        registerListener('findOpportunitiesEventName', this.handleSearchKey, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleSearchKey(searchKeyParam) {
        this.searchKey = searchKeyParam;
    }
    handleError() {
        // eslint-disable-next-line no-console
        const showError = new ShowToastEvent({
            title: "No Opportunities found",
            message: "There are no opportunities for the selected account",
            variant: 'Error',
        });
        this.dispatchEvent(showError);
    }
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleSave(event){
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Opportunities updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             console.log(this.draftValues);
             console.log(this.opportunities);
             this.draftValues = [];
             // Display fresh data in the datatable
            //  return refreshApex(this.opportunities);
        })
        .catch(error => { console.log(error) });
    }

}
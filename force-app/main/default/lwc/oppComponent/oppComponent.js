/* eslint-disable no-console */
/* eslint-disable vars-on-top */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import findOpportunities from '@salesforce/apex/FindOpp.searchOpps';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'OppName', fieldName: 'Name', editable: true },
    { label: 'Amount', fieldName: 'Amount', type: 'number', editable: true },
    { label: 'Probability', fieldName: 'Probability', type: 'number', editable: true },
    { label: 'Stage', fieldName: 'StageName', type: 'picklist', editable: true },
];

export default class DatatableWithInlineEdit extends LightningElement {
    @track columns = columns;
    @track rowOffset = 0;

    @track opportunities;
    @track errror;
    @track searchKey;

    @wire(CurrentPageReference)
    pageRef;
    stringOpp;

    // @wire(findOpportunities, { searchOppByAcc: '$searchKey' }) 
    // opportunities;

    @wire(findOpportunities, { searchOppByAcc: '$searchKey' })
    wiredOppRetrieval({ error, data }) {
        if (data) {
            // eslint-disable-next-line no-console
            console.log("inside if data");
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
        console.log("inside handleerror");
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

}
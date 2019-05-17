import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
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
    searchKey;
    @track opportunities;
    @wire(CurrentPageReference) 
    pageRef;
    stringOpp;

    // @wire(findOpportunities, { searchOppByAcc: '$searchKey' }) 
    // opportunities;

    @wire(findOpportunities, { searchOppByAcc: '$searchKey' }) 
    LoadOpps(result) {
        this.opportunities = JSON.parse(JSON.stringify(result)).data; 
        //console.log(Object.keys());
        console.log(JSON.parse(JSON.stringify(result)).data);
        if (true){
            this.handleError();
        }
        
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

}
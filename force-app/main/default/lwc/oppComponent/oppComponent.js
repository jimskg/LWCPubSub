import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import findOpportunities from '@salesforce/apex/FindOpp.searchOpps';

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

    @wire(CurrentPageReference) 
    pageRef;

    @wire(findOpportunities, { searchOppByAcc: '$searchKey' }) 
    opportunities;

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
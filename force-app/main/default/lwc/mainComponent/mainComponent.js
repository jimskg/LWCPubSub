import { LightningElement, track, wire } from 'lwc';
import getData from '@salesforce/apex/FindAccCont.findAccAndContacts';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class LightningExampleInputSearch extends LightningElement {
    @track searchKey = '';
    @track error;
    @track account;
    // @track accountName;
    @wire (CurrentPageReference) pageRef;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        getData({ searchAccount: this.searchKey })
            .then(result => {
                this.account = result;
                this.error = undefined;

            })
            .catch(error => {
                this.account = undefined;
                this.error = error;
            });
    }

    handleOpps(event) {
        console.log(event.target.value);
        fireEvent(this.pageRef, 'findOpportunitiesEventName' , event.target.value);
    }
}

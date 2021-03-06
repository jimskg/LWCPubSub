import { LightningElement, track, wire } from 'lwc';
import getData from '@salesforce/apex/FindAccCont.findAccAndContacts';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class LightningExampleInputSearch extends LightningElement {
    @track searchKey = '';
    @track error;
    @track account;
    @track errorMsg;
    kati = [];
    @wire (CurrentPageReference) pageRef;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }
    handleSearch() {
        getData({ searchAccount: this.searchKey })
            .then(result => {
                this.account = result;
                this.error = undefined;
                if (Object.keys(result).length){
                    this.errorMsg = '';
                }else {
                    this.errorMsg = '*Could not find any account';
                    console.log(this.errorMsg);
                    fireEvent(this.pageRef, 'findOpportunitiesEventName' , '');
                }
            })
            .catch(error => {
                this.account = undefined;
                this.error = error;
            });
    }
    handleOpps(event) {
        fireEvent(this.pageRef, 'findOpportunitiesEventName' , event.target.value);
    }
}

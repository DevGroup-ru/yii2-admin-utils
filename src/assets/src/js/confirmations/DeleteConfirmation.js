import {BaseConfirmation} from './BaseConfirmation';

class DeleteConfirmation extends BaseConfirmation {
    constructor(element, title="Delete item?", text="Are you sure you want to delete this item?", close="close") {
        super(element, title, text, close);
        this.href = element.attr('href');
    }

    renderButtons() {
        return ` <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">${this.close}</button>
                        <a href="${this.href}" class="btn btn-warning" class="btn btn-outline">Ок</a>
                      </div>`;
    }
}

export {DeleteConfirmation};

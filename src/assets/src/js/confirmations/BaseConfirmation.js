class BaseConfirmation {

    constructor(element, title = "Title", text = "Text", close = "close") {
        this.title = title;
        this.text = text;
        this.close = close;
    }

    static instance(...rest) {
        return new this(...rest).run();
    }

    renderForm() {
        return `<div class="modal fade" role="dialog" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        ${this.renderHead()}
                        ${this.renderBody()}
                        ${this.renderButtons()}
                    </div>
                  </div>
                </div>`;
    }

    renderHead() {
        return `<div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="${this.close}">
                          <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title" >${this.title}</h4>
                      </div>`;
    }

    renderBody() {
        return `<div class="modal-body">
                        ${this.text}
                      </div>`;
    }

    renderButtons() {
        return ` <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">${this.close}</button>
                      </div>`;
    }

    run() {
        $(this.renderForm()).modal('show');
    }
}

export {BaseConfirmation};

import View from './View';
import icons from 'url:../../img/icons.svg';
class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addClickHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page1 and there other pages
    if (currentPage === 1 && numPages > 1) {
      return `
       <button data-goto=${
         currentPage + 1
       } class="btn--inline pagination__btn--next">
            <span>Page${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
      `;
    }
    // last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>

        `;
    }
    // other page
    if (currentPage < numPages) {
      return `
        <button data-goto=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
             <span>Page${currentPage + 1}</span>
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-right"></use>
             </svg>
           </button> 
         <button data-goto=${
           currentPage - 1
         } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page${currentPage - 1}</span>
          </button>

         `;
    }
    //page1 and there is only one page
    return '';
  }
}

export default new paginationView();

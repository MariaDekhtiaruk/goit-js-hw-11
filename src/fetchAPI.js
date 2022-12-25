import { Notify } from 'notiflix';
export default class NewApiServices {
  API_KEY = '32302956-bbb850179db0fe460a4f0a5f2';
  currentPage = 1;
  query = '';
  totalHits = 0;
  perPage = 8;
  isLastPage = false;
  async fetchPictures() {
    const urlAPI = `https://pixabay.com/api/?key=${this.API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.currentPage}&per_page=${this.perPage}
`;
    try {
      const data = await fetch(urlAPI).then(res => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        return res.json();
      });

      const resultData = data.hits;
      if (resultData.length === 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return [];
      }

      this.totalHits = data.totalHits;

      this.lastPage = Math.ceil(data.totalHits / this.perPage);

      if (this.lastPage === this.currentPage) {
        this.isLastPage = true;
      } else {
        this.currentPage += 1;
      }

      return resultData;
    } catch (error) {
      console.log(error.message);
    }
  }
  resetPage() {
    this.currentPage = 1;
    this.isLastPage = false;
  }
  get query() {
    return this.query;
  }

  get totalHits() {
    return this.totalHits;
  }

  get isLastPage() {
    return this.isLastPage;
  }

  set query(newQuery) {
    this.query = newQuery;
  }
}

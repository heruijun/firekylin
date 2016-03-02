'use strict';

import Base from './base.js';
import fs from 'fs';


export default class extends Base {
  /**
   * post list
   * @return {Promise} []
   */
  async listAction(){
    let model = this.model('post');
    let list = await model.getPostList(this.get('page'), {});
    this.assign('postList', list);
    return this.display();
  }
  /**
   * post detail
   * @return {[type]} [description]
   */
  async detailAction(){
    let pathname = this.get('pathname');
    let detail = await this.model('post').where({pathname: pathname}).find();
    this.assign('detail', detail);

    let pageUrl = this.options.is_https ? 'https://' : 'http://';
    pageUrl += this.http.host + this.http.url;
    this.assign('pageUrl', pageUrl);
    
    return this.display();
  }

  async pageAction(){
    let pathname = this.get('pathname');
    let detail = await this.model('post').where({pathname: pathname}).find();
    this.assign('page', detail);

    return this.display();
  }
  /**
   * post archive
   * @return {[type]} [description]
   */
  async archiveAction(){
    let model = this.model('post');
    let data = await model.getPostArchive();
    this.assign('list', data);
    return this.display();
  }
  
  async tagAction(){
    let model = this.model('tag');
    let data = await model.getTagArchive();
    this.assign('list', data);
    return this.display();
  }
  /**
   * rss
   * @return {[type]} [description]
   */
  async rssAction(){
    let model = this.model('post');
    let list = await model.getPostRssList();
    this.assign('list', list);
    this.assign('currentTime', (new Date()).toString());
    
    this.type('text/xml');
    return this.display();
  }
  /**
   * sitemap action
   * @return {[type]} [description]
   */
  async sitemapAction(){
    let model = this.model('post');
    let list = model.getPostSitemapList();
    this.assign('list', list);
    let content = await this.fetch();
    let filePath = think.RESOURCE_PATH + think.sep + 'sitemap.xml';
    fs.writeFile(filePath, content);
    return this.success();
  }
  /**
   * search action
   * @return {[type]} [description]
   */
  async searchAction(){
    let keyword = this.get('keyword').trim();
    if(keyword){
      let postModel = this.model('post');
      let searchResultPromise = postModel.getPostSearch(keyword, this.get('page'));
      this.assign('searchData', searchResultPromise);
    }

    //热门标签
    let tagModel = this.model('tag');
    let hotTagsPromise = tagModel.getHotTags();
    this.assign('hotTags', hotTagsPromise);


    this.assign('keyword', keyword);
    return this.display();
  }
}
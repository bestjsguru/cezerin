import React from 'react'
import { NavLink } from 'react-router-dom'

export const formatNumber = (number, settings) => {
  const x = 3;
  const floatNumber = parseFloat(number || 0) || 0;

  const re = '\\d(?=(\\d{' + x + '})+' + (settings.decimal_number > 0
    ? '\\D'
    : '$') + ')';

  let num = floatNumber.toFixed(Math.max(0, ~~ settings.decimal_number));

  return (settings.decimal_separator
    ? num.replace('.', settings.decimal_separator)
    : num).replace(new RegExp(re, 'g'), '$&' + (settings.thousand_separator));
};

const amountPattern = '{amount}';
export const formatCurrency = (number = 0, settings) => {
  return settings.currency_format.replace(amountPattern, formatNumber(number, settings));
}

export const getThumbnailUrl = (originalUrl, width) => {
  if(originalUrl && originalUrl.length > 0) {
    const pos = originalUrl.lastIndexOf('/');
    const thumbnailUrl = originalUrl.substring(0, pos) + `/${width}/` + originalUrl.substring(pos + 1);
    return thumbnailUrl;
  } else {
    return '';
  }
}

export const getParentIds = (categories, categoryId) => {
  let parentIds = [];
  let parentExists = false;

  do {
    const category = categories.find(item => item.id === categoryId);
    parentExists = category && category.parent_id;
    if(parentExists){
      parentIds.push(category.parent_id)
      categoryId = category.parent_id;
    }
  } while(parentExists)

  return parentIds;
}

export const getProductBreadcrumbs = (product, categories) => {
  if(product && product.category_id){
    let ids = [product.category_id];
    let parentIds = getParentIds(categories, product.category_id);
    ids.push(...parentIds);

    let index = 0;
    const breadcrumbs = ids.reverse().map(categoryId => {
      const category = categories.find(item => item.id === categoryId);
      if(category){
        index++;
        return (
          <li key={index}>
            <NavLink to={category.path}>
              {category.name}
            </NavLink>
          </li>
        )
      }
    })

    return breadcrumbs;
  } else {
    return null;
  }
}

export const getCategoryBreadcrumbs = (currentCategoryId, categories) => {
  if(currentCategoryId){
    let ids = getParentIds(categories, currentCategoryId);

    let index = 0;
    const breadcrumbs = ids.reverse().map(categoryId => {
      const category = categories.find(item => item.id === categoryId);
      if(category){
        index++;
        return (
          <li key={index}>
            <NavLink to={category.path}>
              {category.name}
            </NavLink>
          </li>
        )
      }
    })

    return breadcrumbs;
  } else {
    return null;
  }
}

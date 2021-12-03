import React from 'react';
import { Delete, Edit } from '../Icons';
	
export default function ProductItem({ product = {}, productClass="", hideActions, onEditClick, onDeleteClick }) {
    return (
      <div class={`${productClass} border border-light shadow-sm p-3 card position-relative`}>
				{!hideActions && <div className="d-flex position-absolute end-0 me-2">
					<div className="card p-2 rounded-circle me-2" onClick={()=>onEditClick&&onEditClick(product)}>
						<Edit/>
					</div>
					<div className="card p-2 rounded-circle" onClick={()=>onDeleteClick&&onDeleteClick(product)}>
						<Delete/>
					</div>
				</div>}
        <img
          src={product.img}
          alt=""
          class="product-img img-fluid"
					style={{height: "170px", objectFit: "contain"}}
        />
        <div class="product-name h5">{product.name}</div>
        <div class="product-unit text-muted small">{product.unit}</div>
        <div class="d-flex justify-content-between1 align-items-baseline">
          <div class="product-price text-success fw-bold text-decoration-line-through small">
            {product.currencySymbol}{product.price}
          </div>
          <div class="text-success fw-bold ms-1">{product.currencySymbol}{product.discountedPrice}</div>
        </div>
      </div>
    );
  }
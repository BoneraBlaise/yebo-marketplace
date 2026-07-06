import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";
import { createKnowledgeDocument, matchesQuery, sortByRelevance } from "./KnowledgeHelpers";
import { MOCK_KNOWLEDGE_DOCUMENTS } from "./MockKnowledge";

/** Base knowledge domain — common interface for all domains */
export class BaseKnowledgeDomain {
  constructor(domainId, label) {
    this.domainId = domainId;
    this.label = label;
    this.documents = [];
  }

  getDomainId() {
    return this.domainId;
  }

  getLabel() {
    return this.label;
  }

  seed(documents) {
    this.documents = documents.filter((d) => d.domain === this.domainId);
    return this;
  }

  getDocuments() {
    return [...this.documents];
  }

  getById(id) {
    return this.documents.find((d) => d.id === id) || null;
  }

  search(query, limit = 10) {
    const matched = this.documents.filter((d) => matchesQuery(d, query));
    return sortByRelevance(matched, query).slice(0, limit);
  }

  getRelationships(id) {
    const doc = this.getById(id);
    if (!doc) return [];
    return doc.relationships || [];
  }
}

const seedDomain = (domainId, label) => {
  const domain = new BaseKnowledgeDomain(domainId, label);
  domain.seed(MOCK_KNOWLEDGE_DOCUMENTS);
  return domain;
};

export const ProductKnowledge = seedDomain(KNOWLEDGE_DOMAIN.PRODUCT, "Product Knowledge");
export const VendorKnowledge = seedDomain(KNOWLEDGE_DOMAIN.VENDOR, "Vendor Knowledge");
export const CustomerKnowledge = seedDomain(KNOWLEDGE_DOMAIN.CUSTOMER, "Customer Knowledge");
export const OrderKnowledge = seedDomain(KNOWLEDGE_DOMAIN.ORDER, "Order Knowledge");
export const ReviewKnowledge = seedDomain(KNOWLEDGE_DOMAIN.REVIEW, "Review Knowledge");
export const CategoryKnowledge = seedDomain(KNOWLEDGE_DOMAIN.CATEGORY, "Category Knowledge");
export const BrandKnowledge = seedDomain(KNOWLEDGE_DOMAIN.BRAND, "Brand Knowledge");
export const FashionKnowledge = seedDomain(KNOWLEDGE_DOMAIN.FASHION, "Fashion Knowledge");
export const MarketplaceKnowledge = seedDomain(KNOWLEDGE_DOMAIN.MARKETPLACE, "Marketplace Knowledge");
export const CommissionKnowledge = seedDomain(KNOWLEDGE_DOMAIN.COMMISSION, "Commission Knowledge");
export const ReferralKnowledge = seedDomain(KNOWLEDGE_DOMAIN.REFERRAL, "Referral Knowledge");
export const ShippingKnowledge = seedDomain(KNOWLEDGE_DOMAIN.SHIPPING, "Shipping Knowledge");
export const ReturnsKnowledge = seedDomain(KNOWLEDGE_DOMAIN.RETURNS, "Returns Knowledge");
export const PolicyKnowledge = seedDomain(KNOWLEDGE_DOMAIN.POLICY, "Policy Knowledge");
export const FAQKnowledge = seedDomain(KNOWLEDGE_DOMAIN.FAQ, "FAQ Knowledge");
export const SearchKnowledge = seedDomain(KNOWLEDGE_DOMAIN.SEARCH, "Search Knowledge");
export const FlashSaleKnowledge = seedDomain(KNOWLEDGE_DOMAIN.FLASH_SALE, "Flash Sale Knowledge");
export const AuctionKnowledge = seedDomain(KNOWLEDGE_DOMAIN.AUCTION, "Auction Knowledge");
export const EventKnowledge = seedDomain(KNOWLEDGE_DOMAIN.EVENT, "Event Knowledge");
export const SupportKnowledge = seedDomain(KNOWLEDGE_DOMAIN.SUPPORT, "Support Knowledge");

export const ALL_KNOWLEDGE_DOMAINS = [
  ProductKnowledge,
  VendorKnowledge,
  CustomerKnowledge,
  OrderKnowledge,
  ReviewKnowledge,
  CategoryKnowledge,
  BrandKnowledge,
  FashionKnowledge,
  MarketplaceKnowledge,
  CommissionKnowledge,
  ReferralKnowledge,
  ShippingKnowledge,
  ReturnsKnowledge,
  PolicyKnowledge,
  FAQKnowledge,
  SearchKnowledge,
  FlashSaleKnowledge,
  AuctionKnowledge,
  EventKnowledge,
  SupportKnowledge,
];

export default ALL_KNOWLEDGE_DOMAINS;

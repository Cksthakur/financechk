import { defineNitroConfig } from "nitro/config"

export default defineNitroConfig({
  routeRules: {
    "/gst/": {
      redirect: {
        to: "/tools/tax-calculators",
        status: 301,
      },
    },
    "/sip-calculator": {
      redirect: {
        to: "/tools/sip-calculator",
        status: 301,
      },
    },
    "/sip-calculator/": {
      redirect: {
        to: "/tools/sip-calculator",
        status: 301,
      },
    },
    "/contact": {
      redirect: {
        to: "/about",
        status: 301,
      },
    },
    "/contact/": {
      redirect: {
        to: "/about",
        status: 301,
      },
    },
    "/retirement-planner/": {
      redirect: {
        to: "/retirement-planner",
        status: 301,
      },
    },
    "/insurance": {
      redirect: {
        to: "/tools",
        status: 301,
      },
    },
    "/insurance/": {
      redirect: {
        to: "/tools",
        status: 301,
      },
    },
    "/investing": {
      redirect: {
        to: "/tools/investment-calculators",
        status: 301,
      },
    },
    "/investing/": {
      redirect: {
        to: "/tools/investment-calculators",
        status: 301,
      },
    },
    "/investing/elss-calculator": {
      redirect: {
        to: "/tools/elss-calculator",
        status: 301,
      },
    },
    "/investing/elss-calculator/": {
      redirect: {
        to: "/tools/elss-calculator",
        status: 301,
      },
    },
    "/blog/personal-finance-literacy-guide": {
      redirect: {
        to: "/blog",
        status: 301,
      },
    },
    "/blog/personal-finance-literacy-guide/": {
      redirect: {
        to: "/blog",
        status: 301,
      },
    },
    "/blog/emergency-fund-complete-guide": {
      redirect: {
        to: "/tools/emergency-fund-calculator",
        status: 301,
      },
    },
    "/blog/emergency-fund-complete-guide/": {
      redirect: {
        to: "/tools/emergency-fund-calculator",
        status: 301,
      },
    },
    "/blog/gold-price-outlook-how-will-china-tariffs-impact-mcx-gold-rates-explained":
      {
        redirect: {
          to: "/blog",
          status: 301,
        },
      },
    "/blog/gold-price-outlook-how-will-china-tariffs-impact-mcx-gold-rates-explained/":
      {
        redirect: {
          to: "/blog",
          status: 301,
        },
      },
    "/loans/loan-prepayment": {
      redirect: {
        to: "/tools/personal-loan-prepayment-calculator",
        status: 301,
      },
    },
    "/loans/loan-prepayment/": {
      redirect: {
        to: "/tools/personal-loan-prepayment-calculator",
        status: 301,
      },
    },
    "/loans/personal-loan-comparison": {
      redirect: {
        to: "/tools/loan-calculators",
        status: 301,
      },
    },
    "/loans/personal-loan-comparison/": {
      redirect: {
        to: "/tools/loan-calculators",
        status: 301,
      },
    },
    "/loans/home-loan-emi-calculator": {
      redirect: {
        to: "/tools/advanced-home-loan-emi-calculator",
        status: 301,
      },
    },
    "/loans/home-loan-emi-calculator/": {
      redirect: {
        to: "/tools/advanced-home-loan-emi-calculator",
        status: 301,
      },
    },
    "/loans/loan-balance-transfer": {
      redirect: {
        to: "/tools/personal-loan-balance-transfer-calculator",
        status: 301,
      },
    },
    "/loans/loan-balance-transfer/": {
      redirect: {
        to: "/tools/personal-loan-balance-transfer-calculator",
        status: 301,
      },
    },
    "/tax/hra-exemption": {
      redirect: {
        to: "/tools/hra-calculator",
        status: 301,
      },
    },
    "/tax/hra-exemption/": {
      redirect: {
        to: "/tools/hra-calculator",
        status: 301,
      },
    },
    "/tax/tax-refund-calculator": {
      redirect: {
        to: "/tools/tax-calculators",
        status: 301,
      },
    },
    "/tax/tax-refund-calculator/": {
      redirect: {
        to: "/tools/tax-calculators",
        status: 301,
      },
    },
    "/tax/home-loan-tax-benefit": {
      redirect: {
        to: "/tools/home-loan-tax-benefit-calculator",
        status: 301,
      },
    },
    "/tax/home-loan-tax-benefit/": {
      redirect: {
        to: "/tools/home-loan-tax-benefit-calculator",
        status: 301,
      },
    },
    "/tools/budget-planner": {
      redirect: {
        to: "/tools/emergency-fund-calculator",
        status: 301,
      },
    },
    "/tools/budget-planner/": {
      redirect: {
        to: "/tools/emergency-fund-calculator",
        status: 301,
      },
    },
    "/business/profit-margin": {
      redirect: {
        to: "/tools/depreciation-calculator",
        status: 301,
      },
    },
    "/business/profit-margin/": {
      redirect: {
        to: "/tools/depreciation-calculator",
        status: 301,
      },
    },
    "/business/depreciation-calculator": {
      redirect: {
        to: "/tools/depreciation-calculator",
        status: 301,
      },
    },
    "/business/depreciation-calculator/": {
      redirect: {
        to: "/tools/depreciation-calculator",
        status: 301,
      },
    },
  },
})

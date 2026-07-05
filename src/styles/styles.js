import { spacing } from "../design-system/spacing";
import { typography } from "../design-system/typography";

const styles = {
  custom_container: "w-11/12 hidden sm:block",
  heading: `${typography.heading} text-center md:text-start pb-[20px]`,
  section: spacing.section,
  productTitle: "text-[25px] font-[600] font-Roboto text-yebone-dark-text dark:text-white",
  productDiscountPrice: "font-bold text-[16px] text-yebone-primary font-Roboto",
  price: "font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through",
  shop_name: "pt-3 text-[15px] text-yebone-primary-dark pb-3",
  active_indicator: "absolute bottom-[-27%] left-0 h-[3px] w-full bg-yebone-gold",
  button: "w-[150px] bg-yebone-dark-text h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer",
  cart_button: "px-[20px] h-[38px] rounded-[20px] bg-yebone-primary flex items-center justify-center cursor-pointer",
  cart_button_text: "text-white text-[16px] font-[600]",
  input: "w-full border p-1 rounded-[5px] border-yebone-primary/30 focus:border-yebone-primary",
  activeStatus: "w-[10px] h-[10px] rounded-full absolute top-0 right-1 bg-[#40d132]",
  noramlFlex: "flex items-center",
};

export default styles;

import React from "react";

const Cookies = () => {
  return (
    <div className="p-6 w-[70%] mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Cookie Policy</h1>

      <p className="mb-4 p-2 dark:text-white">
        At Yebone, we use cookies and similar technologies to enhance your
        user experience, personalize your interactions with our platform, and
        improve the performance of our website. By using our website, you
        consent to the use of cookies as outlined in this Cookie Policy. This
        policy explains what cookies are, how we use them, and how you can
        manage your cookie settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">1. What Are Cookies?</h2>
      <p className="mb-4 p-2 dark:text-white">
        Cookies are small text files that are stored on your device when you
        visit websites. They are commonly used to remember user preferences,
        logins, and settings, as well as to track browsing behavior. Cookies can
        either be persistent (remaining on your device for a specified period)
        or session-based (deleted when the browser is closed). Yebone uses
        cookies to offer a personalized browsing experience, allowing us to
        remember your preferences and improve the functionality of our website.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">
        2. Types of Cookies We Use
      </h2>
      <p className="mb-4 p-2 dark:text-white">
        We use several types of cookies on our website, each serving a different
        purpose to enhance your experience:
        <ul className="list-disc ml-6">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for
            the website to function correctly. They enable basic features such
            as page navigation, secure login, and access to certain areas of the
            site.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These cookies collect data
            about how visitors interact with our website, helping us understand
            site traffic, user preferences, and areas for improvement.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These cookies allow the
            website to remember choices you make (such as language preference or
            login details) to provide a more personalized experience on future
            visits.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These cookies are used to track
            your browsing habits and serve ads that are relevant to your
            interests. They help us understand your preferences to improve our
            marketing efforts.
          </li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">
        3. How We Use Cookies
      </h2>
      <p className="mb-4 p-2 dark:text-white">
        The cookies we use on Yebone help us improve your browsing
        experience by remembering your preferences and personalizing the content
        you see. They also allow us to analyze the performance of our platform,
        track user behavior, and make data-driven decisions to enhance
        functionality. For example, cookies help us recognize whether you’ve
        visited our site before or if you’re a new visitor, which can improve
        navigation and make your browsing more efficient. Additionally,
        performance and targeting cookies allow us to serve ads that are
        relevant to your interests both on our platform and across other
        websites.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">
        4. Managing and Controlling Cookies
      </h2>
      <p className="mb-4 p-2 dark:text-white">
        You have full control over the cookies placed on your device. Most web
        browsers allow you to manage cookie preferences through their settings.
        You can set your browser to block or alert you about the presence of
        cookies. However, please note that disabling or blocking certain cookies
        may impact the functionality of our platform, and some features may not
        work as intended. You can adjust your settings to allow essential
        cookies while restricting the use of performance or targeting cookies if
        you prefer. Additionally, you can delete cookies stored on your device
        at any time through your browser’s settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">
        5. Third-Party Cookies
      </h2>
      <p className="mb-4 p-2 dark:text-white">
        Yebone also uses third-party services that may place cookies on your
        device. These third parties may include advertising networks, analytics
        providers, and social media platforms. These cookies help provide
        targeted ads, track user interactions, and gather analytics about our
        platform. Please note that we do not have control over the cookies set
        by these third parties, and they may collect and use your information as
        per their own privacy and cookie policies. We encourage you to review
        the privacy and cookie policies of these third-party services for
        further information.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">6. Cookie Consent</h2>
      <p className="mb-4 p-2 dark:text-white">
        When you visit our website, you will be prompted with a cookie banner
        informing you about our use of cookies. By continuing to use our
        platform, you consent to the use of cookies as described in this policy.
        If you do not agree to our use of cookies, you can adjust your browser
        settings to block cookies or refrain from using our platform. However,
        please note that certain features of the website may not function
        properly if cookies are disabled.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">
        7. Changes to This Cookie Policy
      </h2>
      <p className="mb-4 p-2 dark:text-white">
        We may update this Cookie Policy from time to time to reflect changes in
        our practices or for other operational, legal, or regulatory reasons.
        Any updates to this policy will be posted on this page, and the
        effective date will be clearly indicated at the top. We encourage you to
        review this policy periodically to stay informed about how we use
        cookies and how you can manage them.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 p-2 dark:text-white">8. Contact Us</h2>
      <p className="mb-4 p-2 dark:text-white">
        If you have any questions or concerns about our use of cookies or this
        Cookie Policy, please feel free to contact us. Our support team is
        available to provide further information or assist with any requests you
        may have. You can reach us at{" "}
        <a href="mailto:support@yebone.com" className="text-blue-500">
          support@yebone.com
        </a>
        , and we will be happy to assist you.
      </p>
    </div>
  );
};

export default Cookies;

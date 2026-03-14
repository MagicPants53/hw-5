import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { paths } from "@/shared/config/paths";
import Text from "@/shared/components/Text";
import ArrowDownIcon from "@/shared/components/icons/ArrowDownIcon";

import styles from "./AboutUs.module.scss";

export const metadata: Metadata = {
  title: "Lalasia | About us",
  description: "Learn more about Lalasia furniture store",
};

export const AboutUs: React.FC = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Text tag="p" view="p-14" color="secondary" className={styles.heroLabel}>
            About Lalasia
          </Text>
          <Text tag="h1" view="subtitle" weight="bold" className={styles.heroTitle}>
            A place where you buy less, but better
          </Text>
          <Text tag="p" view="p-16" color="secondary" className={styles.heroSubtitle}>
            Lalasia is an online space with carefully curated products for your
            home, work, and everyday life. We save your time and take over the
            complexity of choice so every purchase feels confident and mindful.
          </Text>
        </div>
      </section>

      <section className={styles.sectionStory}>
        <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
          Our story
        </Text>
        <div className={styles.sectionContent}>
          <div className={styles.sectionText}>
            <div className={styles.gridTwoCols}>
              <Text tag="p" view="p-16" className={styles.paragraph}>
                We began with a small catalog of home and office products that
                we personally used and recommended to friends. Over time, the
                assortment grew, but the principle remained the same: we do not
                add a product to the catalog if we are not ready to use it every
                day.
              </Text>
              <Text tag="p" view="p-16" className={styles.paragraph}>
                Today, Lalasia is a team of people who believe that online
                shopping can be honest, simple, and predictable. We do not chase
                thousands of SKUs and discounts for the sake of discounts.
                Instead, we invest our time into curation, testing, and personal
                support for every order.
              </Text>
            </div>
          </div>
          <div className={styles.statItem}>
            <Text tag="span" view="p-20" weight="bold" className={styles.statNumber}>
              12k+
            </Text>
            <Text tag="span" view="p-14" color="secondary" className={styles.statLabel}>
              orders across the country
            </Text>
            <div className={styles.line} />
            <Text tag="span" view="p-20" weight="bold" className={styles.statNumber}>
              4.8
            </Text>
            <Text tag="span" view="p-14" color="secondary" className={styles.statLabel}>
              average customer rating
            </Text>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            Mission, vision & values
          </Text>
        </div>
        <div className={styles.gridThreeCols}>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Mission
            </Text>
            <Text tag="p" view="p-14" className={styles.paragraph}>
              To help people make confident, conscious choices in a world of
              overwhelming options. To shorten the path from "I want to buy" to
              "I am happy with my purchase" to a few clear steps.
            </Text>
          </div>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Vision
            </Text>
            <Text tag="p" view="p-14" className={styles.paragraph}>
              To become a service people return to not because of discounts, but
              because they trust our curation and service. Step by step, we want
              to turn Lalasia into a personal shopping assistant.
            </Text>
          </div>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Values
            </Text>
            <ul className={styles.list}>
              <li>
                <Text tag="span" view="p-14">Honest descriptions and realistic expectations.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">Curation over endless grids of similar products.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">Care for the customer at every step of the journey.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">Responsibility for both quality and service.</Text>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            How we treat products & customers
          </Text>
          <Text tag="p" view="p-16" color="secondary" className={styles.sectionSubtitle}>
            We do not just sell "different products" — we offer solutions to
            real-life tasks: organizing space, making homes cozier, and
            simplifying daily routines.
          </Text>
        </div>
        <div className={styles.gridThreeCols}>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              How we select products
            </Text>
            <ul className={styles.list}>
              <li>
                <Text tag="span" view="p-14">We test products and study real feedback before launch.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">We evaluate not only specs but also everyday usability.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">We remove items with growing return or complaint rates.</Text>
              </li>
            </ul>
          </div>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              How we treat customers
            </Text>
            <ul className={styles.list}>
              <li>
                <Text tag="span" view="p-14">We speak plainly and do not hide key conditions.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">We offer clear, fair return and warranty policies.</Text>
              </li>
              <li>
                <Text tag="span" view="p-14">
                  We prefer to solve issues rather than argue over fine print.
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            How we work
          </Text>
        </div>
        <div className={styles.gridThreeCols}>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Logistics
            </Text>
            <Text tag="p" view="p-14" className={styles.paragraph}>
              We work with trusted warehouses and delivery providers so we do
              not save on what directly shapes your experience. Delivery times
              and statuses are transparent and always available in your account.
            </Text>
          </div>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Suppliers
            </Text>
            <Text tag="p" view="p-14" className={styles.paragraph}>
              We choose partners based on consistent quality and service, not
              only on price. We regularly review our brand lineup to keep our
              standards high.
            </Text>
          </div>
          <div className={styles.card}>
            <Text tag="h3" view="p-16" weight="bold" className={styles.cardTitle}>
              Support
            </Text>
            <Text tag="p" view="p-14" className={styles.paragraph}>
              Our support is powered by real people, not just scripts. We listen
              to feedback and treat every conversation as a chance to improve
              Lalasia.
            </Text>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text tag="h2" view="p-20" weight="bold" className={styles.sectionTitle}>
            Responsibility & sustainability
          </Text>
        </div>
        <div className={styles.gridTwoCols}>
          <Text tag="p" view="p-18" className={styles.paragraph}>
            We are gradually reducing unnecessary packaging and switching to
            recyclable materials wherever possible. When building our
            assortment, we try to avoid purely disposable, single-use solutions.
          </Text>
          <Text tag="p" view="p-18" className={styles.paragraph}>
            A growing part of our partners share our principles of responsible
            production, and we want this share to keep increasing. For us, your
            comfort should not conflict with common sense and care for the
            future.
          </Text>
        </div>
      </section>

      <section className={styles.sectionCta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <Text tag="h2" view="p-20" weight="bold" className={styles.ctaTitle}>
              Go to Products
            </Text>
            <Text tag="p" view="p-18" className={styles.ctaText}>
              Explore our catalog or reach out — we will help you find the right
              solutions for your needs and budget.
            </Text>
          </div>
          <Link href={paths.products} className={styles.ctaLink} aria-label="Go to products">
            <ArrowDownIcon
              color="secondary"
              style={{ transform: "rotate(-90deg)" }}
            />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

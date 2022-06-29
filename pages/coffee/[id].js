import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
// import coffeeStoresData from "../../data/coffee-stores.json";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-store";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStoresData = await fetchCoffeeStores();

  console.log("params", params);
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id === params.id; //dynamic id
      }),
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores();
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  console.log("router", router);
  const handleUpvoteButton = () => {};
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }

  const { name, imgUrl, location, id, rating, neighborhood } =
    props.coffeeStore;
  console.log("props", props);
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || "/static/hero.png"}
            width={1000}
            height={500}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>
              {/* {geometry?.location} */}
              {neighborhood}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            <p className={styles.text}>
              {/* {plus_code.compound_code.slice(8)} */}
              {location}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>2</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

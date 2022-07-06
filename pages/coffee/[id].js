import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStoresData = await fetchCoffeeStores();

  const findCoffeeStore = coffeeStoresData.find((coffeeStore) => {
    return coffeeStore.id === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStore ? findCoffeeStore : {},
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

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        setCoffeeStore(findCoffeeStoreById);
        handleCreateCoffeeStore(findCoffeeStoreById);
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore]);
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighborhood, address } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighborhood: neighborhood ? neighborhood : "",
          address: address ? address : "",
        }),
      });

      const dbCoffeeStore = await response.json();
      // console.log({ dbCoffeeStore });
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

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
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjc2MTN8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50fGVufDB8fHx8MTY1NjUxOTc3Nw&ixlib=rb-1.2.1&q=80&w=400"
            }
            width={1000}
            height={500}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{votingCount}</p>
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

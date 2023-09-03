"use client";
import { Hero, SearchBar, CustomFilter, CarCard, ShowMore } from '@/components';
import { fuels, yearsOfProduction } from '@/constants';
import { fetchCars }  from '@/utils';
import { useSearchParams } from 'next/navigation';
import React from "react";
import Image from 'next/image';

export default async function Home() {
  const [allCars, setAllCars] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [searchModel, setSearchModel] = React.useState("");
  const [searchManufacturer, setSearchManufacturer] = React.useState("");
  const [limit, setLimit] = React.useState(10);
  const [fuel, setFuel] = React.useState("");
  const [year, setYear] = React.useState(2022);

  const getCars = async () => {
    setLoading(true);
    try {const result = await fetchCars({
      manufacturer: searchManufacturer || "",
      model: searchModel || "",
      fuel: fuel || "",
      limit: limit || 10,
      year: year || 2022,
    })} catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getCars()
  }, [year, fuel, limit, searchManufacturer, searchModel])


  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  return (
    <main className='overflow=hidden'>
      <Hero />
      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>
        <div className='home__filters'>
          <SearchBar setManufacturer={setSearchManufacturer} setModel={setSearchModel} />
          <div className='home__filter-container'>
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel}/>
            <CustomFilter title="year" options={yearsOfProduction} setFilter={setYear}/>
          </div>
        </div>

      {allCars.length > 0? (
        <section>
          <div className='home__cars-wrapper'>
            {allCars?.map((car) => (
              <CarCard key={car} car={car} />
            ))}
          </div>
          {loading && (
            <div className='mt-16 w-full flex-center'>
              <Image 
              src="/loader.svg"
              alt="loader"
              width={50}
              height={50}
              className='object-contain'
              />
            </div>
          )}

          <ShowMore 
          pageNumber={limit / 10}
          isNext={limit > allCars.length}
          setLimit={setLimit}
          />
        </section>
      ): (
      <div className='home__error-container'>
        <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
        <p>{allCars?.message}</p>
      </div>)
      }
      </div>
    </main>
  )
}


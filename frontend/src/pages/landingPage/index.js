import ItemCard from "../../components/card/index.mjs"
import Footer from "../../components/footer"
import Navbar from "../../components/navigation"
import { itemsList } from "../../data/items"
import "../../styles/landingPage/index.css"

export default function LandingPage() {

    return (
        <div className="landing-page-container">
            <Navbar />

            <div className="items-list">
                {
                    itemsList.map((item) => {
                        return <ItemCard
                            key={item.id} userAvatar={item.userAvatar}
                            userName={item.userName} itemImage={item.itemImage}
                            title={item.title} description={item.description}
                            location={item.location} />
                    })
                }

            </div>
            <Footer />
        </div>
    )

}
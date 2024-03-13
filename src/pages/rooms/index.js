import CardCourse from "@/components/roomsCard";
import withAuth from "@/components/withAuth";

function Rooms () {

  return (
    <div>
      <CardCourse />
    </div>
  );
}

export default withAuth(Rooms, ['admin', 'usuario']);

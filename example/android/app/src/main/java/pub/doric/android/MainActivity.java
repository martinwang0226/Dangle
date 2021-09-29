package pub.doric.android;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        RecyclerView sampleRV = findViewById(R.id.sample_rv);

        String[] dataSet = new String[]{
                "Sample1",
                "Sample2",
                "Sample3",
                "Sample4",
                "Sample5",
                "Sample6",
                "misc_animation_groups",
                "misc_animation_keys",
                "misc_controls_drag",
                "misc_lookat",
                "webgl_camera",
                "webgl_camera_array",
                "webgl_effects_peppersghost",
                "webgl_lines_colors",
        };
        CustomAdapter customAdapter = new CustomAdapter(dataSet);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        sampleRV.setLayoutManager(layoutManager);
        sampleRV.setAdapter(customAdapter);

        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(sampleRV.getContext(),
                layoutManager.getOrientation());
        sampleRV.addItemDecoration(dividerItemDecoration);
    }
}
